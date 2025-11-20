/**
 * POST /api/workspaces/[id]/activity
 * Record activity metrics for a workspace
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleAPIError, createErrorResponse, ErrorCodes } from '@/lib/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const environment = await prisma.environment.findUnique({
      where: { id },
    });

    if (!environment) {
      return NextResponse.json(
        createErrorResponse(404, ErrorCodes.NOT_FOUND, 'Workspace not found'),
        { status: 404 }
      );
    }

    if (environment.userId !== payload.id) {
      return NextResponse.json(
        createErrorResponse(403, ErrorCodes.FORBIDDEN, 'Access denied'),
        { status: 403 }
      );
    }

    // Record activity in database
    const activity = await prisma.resourceUsage.create({
      data: {
        environmentId: id,
        cpuUsagePercent: body.cpuUsage || 0,
        memoryUsageMB: body.memoryUsage || 0,
        diskUsageMB: body.diskUsage || 0,
        networkInMB: body.networkIn ? body.networkIn / 1024 : 0,
        networkOutMB: body.networkOut ? body.networkOut / 1024 : 0,
        timestamp: new Date(),
      },
    });

    // Activity recorded in database only
    // Agent API integration can be added later if needed

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * GET /api/workspaces/[id]/activity
 * Get activity history for a workspace
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await requireAuth(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '100');
    const hours = parseInt(searchParams.get('hours') || '24');

    // Verify ownership
    const environment = await prisma.environment.findUnique({
      where: { id },
    });

    if (!environment) {
      return NextResponse.json(
        createErrorResponse(404, ErrorCodes.NOT_FOUND, 'Workspace not found'),
        { status: 404 }
      );
    }

    if (environment.userId !== payload.id) {
      return NextResponse.json(
        createErrorResponse(403, ErrorCodes.FORBIDDEN, 'Access denied'),
        { status: 403 }
      );
    }

    // Get activity history
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const activities = await prisma.resourceUsage.findMany({
      where: {
        environmentId: id,
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        activities,
        period: {
          hours,
          since: since.toISOString(),
        },
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
