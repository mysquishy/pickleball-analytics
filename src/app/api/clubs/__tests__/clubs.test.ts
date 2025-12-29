/**
 * Clubs API Route Tests
 */

import { createMocks } from 'node-mocks-http';
import { POST, GET } from '../route';
import {
  clearDatabase,
  createTestUser,
  createTestOrganization,
  createTestClub,
  createTestMembership,
} from '@/lib/__tests__/setup';
// import { prisma } from '@/lib/prisma';

describe('/api/clubs', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/clubs', () => {
    it('should create a new club with valid data', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'ADMIN',
      });

      const requestBody = {
        organizationId: org.id,
        name: 'Downtown Pickleball',
        slug: 'downtown-pickleball',
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        phone: '512-555-1234',
        email: 'info@downtownpickleball.com',
      };

      const mockRequest = createMocks({
        method: 'POST',
        body: requestBody,
      }).req;

      // Mock auth - simulate authenticated user
      mockRequest.headers = {
        authorization: `Bearer ${user.id}`,
      };

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.club).toBeDefined();
      expect(data.club.name).toBe('Downtown Pickleball');
      expect(data.club.slug).toBe('downtown-pickleball');
    });

    it('should reject duplicate club slugs', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'ADMIN',
      });

      await createTestClub({
        organizationId: org.id,
        name: 'Test Club',
        slug: 'test-club',
      });

      const requestBody = {
        organizationId: org.id,
        name: 'Another Club',
        slug: 'test-club', // Duplicate slug
      };

      const mockRequest = createMocks({
        method: 'POST',
        body: requestBody,
      }).req;

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should require admin role to create club', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'MEMBER', // Not admin
      });

      const requestBody = {
        organizationId: org.id,
        name: 'Test Club',
        slug: 'test-club',
      };

      const mockRequest = createMocks({
        method: 'POST',
        body: requestBody,
      }).req;

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBeDefined();
    });

    it('should validate required fields', async () => {
      const requestBody = {
        // Missing required fields
      };

      const mockRequest = createMocks({
        method: 'POST',
        body: requestBody,
      }).req;

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/clubs', () => {
    it('should list all clubs for user organizations', async () => {
      const user = await createTestUser();
      const org1 = await createTestOrganization();
      const org2 = await createTestOrganization();

      await createTestMembership({
        userId: user.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });

      await createTestClub({
        organizationId: org1.id,
        name: 'Club 1',
      });

      await createTestClub({
        organizationId: org1.id,
        name: 'Club 2',
      });

      // Create club in different org (should not appear)
      await createTestClub({
        organizationId: org2.id,
        name: 'Club 3',
      });

      const mockRequest = createMocks({
        method: 'GET',
      }).req;

      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.clubs).toBeDefined();
      expect(data.clubs.length).toBe(2);
    });

    it('should return empty array for user with no clubs', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'MEMBER',
      });

      const mockRequest = createMocks({
        method: 'GET',
      }).req;

      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.clubs).toBeDefined();
      expect(data.clubs.length).toBe(0);
    });
  });
});
