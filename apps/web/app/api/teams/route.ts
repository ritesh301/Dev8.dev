/**
 * POST /api/teams
 * Create a new team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createTeamSchema } from '@/lib/validations';
import { handleAPIError, createErrorResponse, ErrorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth(request);
    const body = await request.json();

    // Validate request
    const validation = createTeamSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(400, ErrorCodes.VALIDATION_ERROR, 'Invalid input', validation.error.issues),
        { status: 400 }
      );
    }

    const { name, slug, description, logo } = validation.data;

    // Check slug uniqueness
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      return NextResponse.json(
        createErrorResponse(409, ErrorCodes.CONFLICT, 'Team slug already exists'),
        { status: 409 }
      );
    }

    // Create team with user as OWNER
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description,
        logo,
        members: {
          create: {
            userId: payload.userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          where: { userId: payload.userId },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Team created successfully',
        data: {
          team: {
            id: team.id,
            name: team.name,
            slug: team.slug,
            description: team.description,
            logo: team.logo,
            plan: team.plan,
            createdAt: team.createdAt,
          },
          membership: {
            role: team.members[0]?.role || 'OWNER',
            joinedAt: team.members[0]?.joinedAt || team.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const { response, status } = handleAPIError(error);
    return NextResponse.json(response, { status });
  }
}

/**
 * GET /api/teams
 * List user's teams
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's team memberships
    const memberships = await prisma.teamMember.findMany({
      where: { userId: payload.userId },
      include: {
        team: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.teamMember.count({
      where: { userId: payload.userId },
    });

    const teams = memberships.map((membership) => ({
      id: membership.team.id,
      name: membership.team.name,
      slug: membership.team.slug,
      description: membership.team.description,
      logo: membership.team.logo,
      plan: membership.team.plan,
      memberCount: membership.team._count.members,
      myRole: membership.role,
      createdAt: membership.team.createdAt,
      joinedAt: membership.joinedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        teams,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    const { response, status } = handleAPIError(error);
    return NextResponse.json(response, { status });
  }
}
