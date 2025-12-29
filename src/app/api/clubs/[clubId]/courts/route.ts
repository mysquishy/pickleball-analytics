import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a court
const createCourtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  surface: z.string().max(50).optional(),
  lighting: z.boolean().default(true),
  indoors: z.boolean().default(true),
});

// GET /api/clubs/[clubId]/courts
export async function GET(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    // Get club to verify permissions
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user is member of the club's organization
    await requireOrganizationRole(session.user.id, club.organizationId, 'MEMBER');

    const courts = await prisma.court.findMany({
      where: {
        clubId,
      },
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ courts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get courts' },
      { status: 403 }
    );
  }
}

// POST /api/clubs/[clubId]/courts
export async function POST(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    const body = await req.json();
    const data = createCourtSchema.parse(body);

    // Get club to verify permissions
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user can create courts (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, club.organizationId, 'ADMIN');

    // Create the court
    const court = await prisma.court.create({
      data: {
        clubId,
        name: data.name,
        surface: data.surface || null,
        lighting: data.lighting,
        indoors: data.indoors,
      },
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
    });

    return NextResponse.json({ court }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create court' },
      { status: 400 }
    );
  }
}
