# Planify

Planify is a web application for organizing groups and coordinating schedules. Users can create groups, manage group membership, and record their availability to make scheduling easier.

The project was originally developed as a final project for **Stockton University's Web Application Engineering (CSCI 4135)** and was later substantially rewritten around PostgreSQL and Prisma.

## Features

* Google authentication
* Create and manage groups
* Manage group membership and roles
* Record and manage personal availability
* View group member availability
* Persistent PostgreSQL data storage
* Type-safe database access with Prisma

## Tech Stack

* **Framework:** Next.js
* **Language:** TypeScript
* **UI:** React, Tailwind CSS
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Database Hosting:** Neon
* **Authentication:** Auth.js
* **Deployment:** Vercel

## Architecture

Planify is built with Next.js and TypeScript, with Prisma providing type-safe access to a PostgreSQL database.

The application separates presentation, application logic, and database operations into distinct layers. Server actions handle communication between the client and server, while service functions encapsulate database operations.

Prisma's generated types are used throughout the application to maintain consistency between the database schema and the TypeScript codebase.

## Database

Planify uses PostgreSQL as its primary database, with Prisma serving as the ORM.

The database schema is defined in:

```text id="y3f0v1"
prisma/schema.prisma
```

Prisma migrations are used to manage changes to the database schema.

## Getting Started

### Prerequisites

You will need:

* Node.js
* npm
* A PostgreSQL database
* Google OAuth credentials

### Installation

Clone the repository:

```bash id="c7p4p5"
git clone https://github.com/ParthP22/Planify.git
cd Planify
```

Install dependencies:

```bash id="r4j2c8"
npm install
```

The `postinstall` script automatically generates the Prisma client after installation.

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env id="j1x8v3"
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXTAUTH_URL=
```

* `DATABASE_URL` — Connection string for the PostgreSQL database.
* `AUTH_SECRET` — Secret used by Auth.js for authentication.
* `AUTH_GOOGLE_ID` — Google OAuth client ID.
* `AUTH_GOOGLE_SECRET` — Google OAuth client secret.
* `NEXTAUTH_URL` — The canonical URL of the application used by the authentication system.

Do not commit your `.env` file or expose any of these values publicly.

### Generate the Prisma Client

If necessary, the Prisma client can be generated manually with:

```bash id="p6q0w4"
npx prisma generate
```

### Run the Development Server

Start the development server with:

```bash id="m8n3s6"
npm run dev
```

The application will be available at http://localhost:3000.

## Available Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start the Next.js development server |
| `npm run build`       | Build the application for production |
| `npm start`           | Start the production server          |
| `npm run lint`        | Run ESLint                           |
| `npm run postinstall` | Generate the Prisma client           |

## Project History

### `csci4135-final-project`

The original version of Planify was developed as the final project for Stockton University's Web Application Engineering course (CSCI 4135).

### `v0.2.0 — Prisma/PostgreSQL Rewrite`

The project was substantially rewritten around PostgreSQL and Prisma. This release represents a major architectural milestone and establishes the foundation for future development.

Major changes include:

* Migrated the data layer to PostgreSQL
* Introduced Prisma ORM
* Redesigned the database schema and relationships
* Added type-safe database access
* Restructured application logic and database operations
* Improved error handling and application architecture
* Reworked the application around a Next.js/TypeScript architecture
* Deployed the PostgreSQL database using Neon

## Future Development

Planify is an ongoing project. Future development will focus on expanding scheduling functionality, improving the user experience, and adding additional tools for group coordination.

## License

This project is currently not licensed for redistribution.
