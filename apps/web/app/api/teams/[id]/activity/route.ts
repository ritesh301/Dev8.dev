/**
 * GET /api/teams/[id]/activity
 * Get team activity logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { handleAPIError, createErrorResponse, ErrorCodes } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    await params;

    // Team functionality not yet implemented in database schema
    return NextResponse.json(
      createErrorResponse(501, ErrorCodes.NOT_FOUND, 'Team features are not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
