# Task Manager — Back-End

REST API for the Task Manager application built with **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Runtime      | Node.js                        |
| Framework    | Express 5                       |
| Language     | TypeScript 5.9                  |
| ORM          | Prisma 7 (with `@prisma/adapter-pg`) |
| Database     | PostgreSQL                      |
| Auth         | JWT (`jsonwebtoken`) + bcrypt   |

---

## Project Structure

```
back-end/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Task, Tag)
│   └── migrations/            # Prisma migration files
├── src/
│   ├── index.ts               # App entry point (Express bootstrap)
│   ├── routes/index.ts        # All route definitions
│   ├── controllers/
│   │   ├── auth.ts            # Register & Login
│   │   ├── task.ts            # CRUD for tasks
│   │   └── tag.ts             # CRUD for tags
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   └── generated/prisma/      # Auto-generated Prisma client
├── prisma.config.ts           # Prisma configuration
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** instance (local or hosted)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `back-end/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
```

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

The server starts on **http://localhost:5000**.

---

## API Endpoints

All routes are prefixed with `/api`.

### Authentication

| Method | Endpoint         | Description              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| POST   | `/api/register`  | Create a new account     | No   |
| POST   | `/api/login`     | Login & receive JWT      | No   |

### Tasks

| Method | Endpoint          | Description              | Auth |
| ------ | ----------------- | ------------------------ | ---- |
| POST   | `/api/tasks`      | Create a task            | Yes  |
| GET    | `/api/tasks`      | List all user tasks      | Yes  |
| PUT    | `/api/tasks/:id`  | Update a task            | Yes  |
| DELETE | `/api/tasks/:id`  | Delete a task            | Yes  |

### Tags

| Method | Endpoint          | Description              | Auth |
| ------ | ----------------- | ------------------------ | ---- |
| POST   | `/api/tags`       | Create a tag             | Yes  |
| GET    | `/api/tags`       | List all user tags       | Yes  |
| DELETE | `/api/tags/:id`   | Delete a tag             | Yes  |

> **Auth** — Send the JWT as a Bearer token in the `Authorization` header:
> ```
> Authorization: Bearer <token>
> ```

---

## Database Schema

Three models managed by Prisma:

- **User** — `id`, `name`, `email` (unique), `password`
- **Task** — `id`, `content`, `startDate`, `dueDate`, linked to a User and optionally to a Tag
- **Tag** — `id`, `name`, `color`, linked to a User

---

## Scripts

| Command        | Description                                   |
| -------------- | --------------------------------------------- |
| `npm run dev`  | Start dev server with hot-reload (`ts-node-dev`) |
| `npm test`     | *(not configured yet)*                        |

---

## Postman Collection

A ready-made Postman collection is included at the project root:

```
Task-Manager.postman_collection.json
```

Import it into Postman to test all endpoints.
