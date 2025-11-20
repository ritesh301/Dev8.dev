/**
 * GET /api/teams/[id]/workspaces
 * List team workspaces
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { handleAPIError, createErrorResponse, ErrorCodes } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth(request);
    const { id } = await params;

    // Team functionality not yet implemented in database schema
    return NextResponse.json(
      createErrorResponse(501, ErrorCodes.NOT_FOUND, 'Team features are not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
