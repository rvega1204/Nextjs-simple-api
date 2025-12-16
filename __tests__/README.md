# API Tests

This directory contains comprehensive tests for all CRUD operations in the Next.js API.

## Test Files

### users.test.ts
Tests for `/api/users` endpoint:
- **GET /users** - Retrieve all users
  - Returns empty array when no users exist
  - Returns all users when they exist

- **POST /users** - Create a new user
  - Creates user with valid data
  - Returns 400 when name is missing
  - Returns 400 when email is missing
  - Returns 400 when age is missing
  - Adds user to existing users list

### users-id.test.ts
Tests for `/api/users/:id` endpoint:
- **GET /users/:id** - Retrieve a single user
  - Returns user by ID
  - Returns 404 when user not found
  - Returns correct user for different IDs

- **PUT /users/:id** - Update a user
  - Updates all fields
  - Updates only name field
  - Updates only email field
  - Updates only age field
  - Returns 404 when updating non-existent user
  - Persists changes to file

- **DELETE /users/:id** - Delete a user
  - Deletes user by ID
  - Removes user from file
  - Returns 404 when deleting non-existent user
  - Does not affect other users
  - Handles deleting the last user

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

- **Framework**: Jest with ts-jest
- **Test Environment**: Node
- **Isolation**: Tests run serially (maxWorkers: 1) to prevent file conflicts
- **Backup Strategy**: Each test suite backs up the original data and restores it after completion

## Notes

- Tests automatically backup and restore the `users.json` file to ensure no side effects
- All CRUD operations are tested with both success and error cases
- Tests verify both response status codes and data integrity
