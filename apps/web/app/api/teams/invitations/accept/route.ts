import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { handleAPIError, createErrorResponse, ErrorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    return NextResponse.json(
      createErrorResponse(501, ErrorCodes.NOT_FOUND, 'Team features are not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request);
    return NextResponse.json(
      createErrorResponse(501, ErrorCodes.NOT_FOUND, 'Team features are not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
