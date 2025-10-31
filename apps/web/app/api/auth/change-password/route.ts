/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { changePasswordSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/jwt';
import { handleAPIError, createErrorResponse, ErrorCodes, APIError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await requireAuth(request);

    const body = await request.json();
    
    // Validate request
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(400, ErrorCodes.VALIDATION_ERROR, 'Invalid input', validation.error.issues),
        { status: 400 }
      );
    }

    const { oldPassword, newPassword } = validation.data;

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        createErrorResponse(400, ErrorCodes.VALIDATION_ERROR, passwordValidation.message || 'Invalid password'),
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        createErrorResponse(404, ErrorCodes.USER_NOT_FOUND, 'User not found'),
        { status: 404 }
      );
    }

    // Verify old password
    const isValid = await verifyPassword(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        createErrorResponse(401, ErrorCodes.INVALID_CREDENTIALS, 'Current password is incorrect'),
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    const { response, status } = handleAPIError(error);
    return NextResponse.json(response, { status });
  }
}
