import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for updating a court
const updateCourtSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  surface: z.string().max(50).optional(),
  lighting: z.boolean().optional(),
  indoors: z.boolean().optional(),
});

// GET /api/courts/[courtId]
export async function GET(req: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courtId } = await params;

  try {
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            organizationId: true,
          },
        },
        _count: {
          select: {
            matches: true,
          },
        },
      },
    });

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    // Verify user is member of the club's organization
    await requireOrganizationRole(session.user.id, court.club.organizationId, 'MEMBER');

    return NextResponse.json({ court });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get court' },
      { status: 403 }
    );
  }
}

// PUT /api/courts/[courtId]
export async function PUT(req: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courtId } = await params;

  try {
    const body = await req.json();
    const data = updateCourtSchema.parse(body);

    // Get court to check permissions
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: {
        club: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    // Verify user can update courts (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, court.club.organizationId, 'ADMIN');

    // Update the court
    const updatedCourt = await prisma.court.update({
      where: { id: courtId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.surface !== undefined && { surface: data.surface || null }),
        ...(data.lighting !== undefined && { lighting: data.lighting }),
        ...(data.indoors !== undefined && { indoors: data.indoors }),
      },
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
    });

    return NextResponse.json({ court: updatedCourt });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update court' },
      { status: 400 }
    );
  }
}

// DELETE /api/courts/[courtId]
export async function DELETE(req: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courtId } = await params;

  try {
    // Get court to check permissions
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: {
        club: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    // Verify user can delete courts (must be OWNER)
    await requireOrganizationRole(session.user.id, court.club.organizationId, 'OWNER');

    // Delete the court (cascade will handle matches)
    await prisma.court.delete({
      where: { id: courtId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete court' },
      { status: 400 }
    );
  }
}
