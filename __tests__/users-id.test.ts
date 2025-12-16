import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { GET, PUT, DELETE } from '../app/users/[id]/route';
import { promises as fs } from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'app/users/users.json');

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

describe('Users API - GET /users/:id', () => {
  let originalData: string | null = null;

  beforeEach(async () => {
    try {
      originalData = await fs.readFile(usersFile, 'utf-8');
    } catch (error) {
      originalData = null;
    }
    await fs.writeFile(usersFile, JSON.stringify(mockUsers, null, 2), 'utf-8');
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

  it('should return a user by id', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '1' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers[0]);
  });

  it('should return 404 when user is not found', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '999' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return the correct user for different ids', async () => {
    const request = {} as any;
    const params2 = Promise.resolve({ id: '2' });

    const response = await GET(request, { params: params2 });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers[1]);
    expect(data.name).toBe('Jane Smith');
  });
});

describe('Users API - PUT /users/:id', () => {
  let originalData: string | null = null;

  beforeEach(async () => {
    try {
      originalData = await fs.readFile(usersFile, 'utf-8');
    } catch (error) {
      originalData = null;
    }
    await fs.writeFile(usersFile, JSON.stringify(mockUsers, null, 2), 'utf-8');
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

  it('should update a user with all fields', async () => {
    const updates = { name: 'John Updated', email: 'john.updated@example.com', age: 31 };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '1' });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('1');
    expect(data.name).toBe('John Updated');
    expect(data.email).toBe('john.updated@example.com');
    expect(data.age).toBe(31);
  });

  it('should update only the name field', async () => {
    const updates = { name: 'John Updated Only Name' };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '1' });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('John Updated Only Name');
    expect(data.email).toBe('john@example.com');
    expect(data.age).toBe(30);
  });

  it('should update only the email field', async () => {
    const updates = { email: 'newemail@example.com' };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '2' });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Jane Smith');
    expect(data.email).toBe('newemail@example.com');
    expect(data.age).toBe(25);
  });

  it('should update only the age field', async () => {
    const updates = { age: 40 };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '3' });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Bob Johnson');
    expect(data.email).toBe('bob@example.com');
    expect(data.age).toBe(40);
  });

  it('should return 404 when updating non-existent user', async () => {
    const updates = { name: 'Does Not Exist' };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '999' });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should persist changes to file', async () => {
    const updates = { name: 'Persisted Name' };
    const request = {
      json: async () => updates
    } as any;
    const params = Promise.resolve({ id: '1' });

    await PUT(request, { params });

    const fileData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(fileData);
    const updatedUser = users.find((u: any) => u.id === '1');

    expect(updatedUser.name).toBe('Persisted Name');
  });
});

describe('Users API - DELETE /users/:id', () => {
  let originalData: string | null = null;

  beforeEach(async () => {
    try {
      originalData = await fs.readFile(usersFile, 'utf-8');
    } catch (error) {
      originalData = null;
    }
    await fs.writeFile(usersFile, JSON.stringify(mockUsers, null, 2), 'utf-8');
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

  it('should delete a user by id', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '1' });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers[0]);
  });

  it('should remove user from file', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '2' });

    await DELETE(request, { params });

    const fileData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(fileData);

    expect(users.length).toBe(2);
    expect(users.find((u: any) => u.id === '2')).toBeUndefined();
  });

  it('should return 404 when deleting non-existent user', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '999' });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should not affect other users when deleting', async () => {
    const request = {} as any;
    const params = Promise.resolve({ id: '2' });

    await DELETE(request, { params });

    const fileData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(fileData);

    expect(users.length).toBe(2);
    expect(users[0]).toEqual(mockUsers[0]);
    expect(users[1]).toEqual(mockUsers[2]);
  });

  it('should handle deleting the last user', async () => {
    await fs.writeFile(usersFile, JSON.stringify([mockUsers[0]], null, 2), 'utf-8');

    const request = {} as any;
    const params = Promise.resolve({ id: '1' });

    const response = await DELETE(request, { params });

    const fileData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(fileData);

    expect(response.status).toBe(200);
    expect(users.length).toBe(0);
  });
});
