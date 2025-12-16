import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { GET, POST } from '../app/users/route';
import { promises as fs } from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'app/users/users.json');
const backupFile = path.join(process.cwd(), 'app/users/users.backup.json');

describe('Users API - GET /users', () => {
  let originalData: string | null = null;

  beforeEach(async () => {
    try {
      originalData = await fs.readFile(usersFile, 'utf-8');
    } catch (error) {
      originalData = null;
    }
  });

  afterEach(async () => {
    if (originalData !== null) {
      await fs.writeFile(usersFile, originalData, 'utf-8');
    } else {
      try {
        await fs.unlink(usersFile);
      } catch {
        // File doesn't exist
      }
    }
  });

  it('should return an empty array when no users exist', async () => {
    await fs.writeFile(usersFile, '[]', 'utf-8');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return all users', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 }
    ];
    await fs.writeFile(usersFile, JSON.stringify(mockUsers, null, 2), 'utf-8');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);
    expect(data.length).toBe(2);
  });
});

describe('Users API - POST /users', () => {
  let originalData: string | null = null;

  beforeEach(async () => {
    try {
      originalData = await fs.readFile(usersFile, 'utf-8');
    } catch (error) {
      originalData = null;
    }
    await fs.writeFile(usersFile, '[]', 'utf-8');
  });

  afterEach(async () => {
    if (originalData !== null) {
      await fs.writeFile(usersFile, originalData, 'utf-8');
    } else {
      try {
        await fs.unlink(usersFile);
      } catch {
        // File doesn't exist
      }
    }
  });

  it('should create a new user with valid data', async () => {
    const newUser = { name: 'Alice Brown', email: 'alice@example.com', age: 28 };

    const request = {
      json: async () => newUser
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject(newUser);
    expect(data.id).toBeDefined();
    expect(typeof data.id).toBe('string');
  });

  it('should return 400 when name is missing', async () => {
    const invalidUser = { email: 'test@example.com', age: 25 };

    const request = {
      json: async () => invalidUser
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing name, email, or age');
  });

  it('should return 400 when email is missing', async () => {
    const invalidUser = { name: 'Test User', age: 25 };

    const request = {
      json: async () => invalidUser
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing name, email, or age');
  });

  it('should return 400 when age is missing', async () => {
    const invalidUser = { name: 'Test User', email: 'test@example.com' };

    const request = {
      json: async () => invalidUser
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing name, email, or age');
  });

  it('should add user to existing users list', async () => {
    const existingUsers = [
      { id: '1', name: 'Existing User', email: 'existing@example.com', age: 30 }
    ];
    await fs.writeFile(usersFile, JSON.stringify(existingUsers, null, 2), 'utf-8');

    const newUser = { name: 'New User', email: 'new@example.com', age: 25 };
    const request = {
      json: async () => newUser
    } as any;

    await POST(request);

    const updatedData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(updatedData);

    expect(users.length).toBe(2);
    expect(users[0]).toEqual(existingUsers[0]);
    expect(users[1]).toMatchObject(newUser);
  });
});
