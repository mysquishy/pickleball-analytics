import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization through membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        role: 'OWNER', // Only owners can export
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden - Not an organization owner' }, { status: 403 });
    }

    const organizationId = membership.organizationId;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'users';
    const format = searchParams.get('format') || 'json';

    let data: unknown = [];
    let filename = 'export';

    switch (type) {
      case 'users': {
        // Get all members of this organization
        const memberships = await prisma.membership.findMany({
          where: { organizationId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
              },
            },
          },
        });
        data = memberships.map((m) => ({ ...m.user, memberRole: m.role }));
        filename = `users-${Date.now()}`;
        break;
      }

      case 'revenue': {
        const revenue = await prisma.subscription.findMany({
          where: { organizationId },
        });
        data = revenue;
        filename = `revenue-${Date.now()}`;
        break;
      }

      case 'analytics': {
        const analytics = await prisma.usage.findMany({
          where: { organizationId },
          orderBy: { timestamp: 'desc' },
          take: 1000,
        });
        data = analytics;
        filename = `analytics-${Date.now()}`;
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    if (format === 'csv') {
      // Convert to CSV
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    }

    // Default JSON response
    return NextResponse.json(data, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}

function convertToCSV(data: unknown): string {
  const items = Array.isArray(data) ? data : [data];

  if (items.length === 0) return '';

  const headers = Object.keys(items[0] as object);
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  for (const item of items) {
    const values = headers.map((header) => {
      const value = (item as Record<string, unknown>)[header];
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value ?? '');
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}
