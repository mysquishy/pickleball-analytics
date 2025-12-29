import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for updating a club
const updateClubSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(500).optional(),
});

// GET /api/clubs/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            courts: true,
            players: true,
            matches: true,
            leagues: true,
          },
        },
      },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user is member of the club's organization
    await requireOrganizationRole(session.user.id, club.organizationId, 'MEMBER');

    return NextResponse.json({ club });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get club' },
      { status: 403 }
    );
  }
}

// PUT /api/clubs/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateClubSchema.parse(body);

    // Get the club first to check organization
    const club = await prisma.club.findUnique({
      where: { id },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user can update clubs (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, club.organizationId, 'ADMIN');

    // If updating slug, check it's not taken
    if (data.slug && data.slug !== club.slug) {
      const existingClub = await prisma.club.findUnique({
        where: { slug: data.slug },
      });

      if (existingClub) {
        return NextResponse.json(
          { error: 'A club with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the club
    const updatedClub = await prisma.club.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.address !== undefined && { address: data.address || null }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.state !== undefined && { state: data.state || null }),
        ...(data.zipCode !== undefined && { zipCode: data.zipCode || null }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.description !== undefined && { description: data.description || null }),
      },
      include: {
        _count: {
          select: {
            courts: true,
            players: true,
            matches: true,
            leagues: true,
          },
        },
      },
    });

    return NextResponse.json({ club: updatedClub });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update club' },
      { status: 400 }
    );
  }
}

// DELETE /api/clubs/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Get the club first to check organization
    const club = await prisma.club.findUnique({
      where: { id },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user can delete clubs (must be OWNER)
    await requireOrganizationRole(session.user.id, club.organizationId, 'OWNER');

    // Delete the club (cascade will handle courts, players, matches, leagues)
    await prisma.club.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete club' },
      { status: 400 }
    );
  }
}
