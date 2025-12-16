import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Path to the users.json file
const usersFile = path.join(process.cwd(), "app/users/users.json");

// Function to read users from the JSON file
async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data) as User[];
  } catch {
    // If file doesn't exist or is unreadable, return an empty array
    return [];
  }
}

// Function to write updated users to the JSON file
async function writeUsers(users: User[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8");
}

// GET /users/:id - Fetch a user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const users = await readUsers();

  // Find the user by ID
  const user = users.find((u) => u.id === id);

  // Return 404 if user is not found
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return the found user
  return NextResponse.json(user);
}

// PUT /users/:id - Update a user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const body = await request.json();

  // Extract optional fields from request body
  const { name, email, age } = body as {
    name?: string;
    email?: string;
    age?: number;
  };

  const users = await readUsers();

  // Find the index of the user to update
  const index = users.findIndex((u) => u.id === id);

  // Return 404 if user not found
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Update the user only with provided fields
  users[index] = {
    ...users[index],
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(age !== undefined ? { age } : {}),
  };

  await writeUsers(users);

  // Return the updated user
  return NextResponse.json(users[index]);
}

// DELETE /users/:id - Delete a user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const users = await readUsers();

  // Find the index of the user to delete
  const index = users.findIndex((u) => u.id === id);

  // Return 404 if user not found
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Remove user from the array and save updated list
  const [deleted] = users.splice(index, 1);
  await writeUsers(users);

  // Return the deleted user
  return NextResponse.json(deleted);
}