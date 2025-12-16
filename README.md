# Next.js API - User Management System

A lightweight RESTful API built with Next.js 16 for managing user data with full CRUD operations. Data is persisted in a JSON file, making it perfect for learning, prototyping, or small-scale applications.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful API design
- ✅ File-based data storage (JSON)
- ✅ TypeScript support
- ✅ Comprehensive test coverage (21 tests)
- ✅ Input validation
- ✅ Error handling

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| GET | `/users/:id` | Get a user by ID |
| PUT | `/users/:id` | Update a user by ID |
| DELETE | `/users/:id` | Delete a user by ID |

### Root

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |

## Data Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rvega1204/Nextjs-simple-api.git
cd next-api
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser or API client.

## API Usage Examples

### Get all users
```bash
curl http://localhost:3000/users
```

### Create a new user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

### Get a single user
```bash
curl http://localhost:3000/users/1
```

### Update a user
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "age": 31}'
```

### Delete a user
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Project Structure

```
next-api/
├── app/
│   ├── route.ts                 # Root endpoint
│   └── users/
│       ├── route.ts             # GET /users, POST /users
│       ├── [id]/
│       │   └── route.ts         # GET, PUT, DELETE /users/:id
│       └── users.json           # Data storage
├── __tests__/
│   ├── users.test.ts            # Tests for GET, POST /users
│   ├── users-id.test.ts         # Tests for GET, PUT, DELETE /users/:id
│   └── README.md                # Test documentation
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

## Testing

The project includes comprehensive test coverage for all CRUD operations.

### Run tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- ✅ 21 tests covering all endpoints
- ✅ Success and error cases
- ✅ Input validation
- ✅ Data persistence
- ✅ Edge cases

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - TypeScript preprocessor for Jest

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) Ricardo Vega 2025
