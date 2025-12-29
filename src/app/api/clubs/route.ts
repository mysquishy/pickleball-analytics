import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a club
const createClubSchema = z.object({
  organizationId: z.string().cuid2(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(500).optional(),
});

// GET /api/clubs?organizationId=xxx
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ error: 'organizationId required' }, { status: 400 });
  }

  try {
    // Verify user is at least member of organization
    await requireOrganizationRole(session.user.id, organizationId, 'MEMBER');

    const clubs = await prisma.club.findMany({
      where: {
        organizationId,
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
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ clubs });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get clubs' },
      { status: 403 }
    );
  }
}

// POST /api/clubs
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createClubSchema.parse(body);

    // Verify user can create clubs (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, data.organizationId, 'ADMIN');

    // Check if slug is already taken
    const existingClub = await prisma.club.findUnique({
      where: { slug: data.slug },
    });

    if (existingClub) {
      return NextResponse.json({ error: 'A club with this slug already exists' }, { status: 409 });
    }

    // Create the club
    const club = await prisma.club.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        slug: data.slug,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        description: data.description || null,
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

    return NextResponse.json({ club }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create club' },
      { status: 400 }
    );
  }
}
