import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { promises as fs } from "fs"; // Importing promise-based filesystem methods
import path from "path"; // For handling file paths

// Define the structure of a User object
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Define the path to the users.json file
const usersFile = path.join(process.cwd(), "app/users/users.json");

// Read users from the JSON file and return them as an array
async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data) as User[];
  } catch {
    // If file doesn't exist or fails to read, return empty array
    return [];
  }
}

// Write updated users array to the JSON file
async function writeUsers(users: User[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8");
}

// Handle GET request: return list of users
export async function GET() {
  const users = await readUsers();
  return NextResponse.json(users);
}

// Handle POST request: add a new user
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Destructure and validate input fields
  const { name, email, age } = body as {
    name?: string;
    email?: string;
    age?: number;
  };

  // Return 400 if any required field is missing
  if (!name || !email || age === undefined) {
    return NextResponse.json(
      { error: "Missing name, email, or age" },
      { status: 400 }
    );
  }

  // Read existing users
  const users = await readUsers();

  // Create new user object with unique ID based on timestamp
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    age,
  };

  // Add new user to the list and save to file
  users.push(newUser);
  await writeUsers(users);

  // Return the newly created user with 201 Created status
  return NextResponse.json(newUser, { status: 201 });
}