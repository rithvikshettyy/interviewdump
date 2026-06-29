'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import { ChevronDown, ChevronUp, Server, Database, ShieldCheck, Lock, Network } from 'lucide-react'

interface TopicCard {
  id: string
  title: string
  teaser: string
  explanation: string
  analogy?: string
  code?: string
  codeLang?: string
  tags?: string[]
}

interface Category {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  topics: TopicCard[]
}

const CATEGORIES: Category[] = [
  {
    id: 'nodejs',
    label: 'Node.js & Express',
    icon: Server,
    topics: [
      {
        id: 'node-event-loop',
        title: 'Node.js & The Event Loop',
        teaser: 'How Node.js handles thousands of concurrent connections on a single thread.',
        explanation: `Node.js runs JavaScript on the server using the V8 engine. It is single-threaded — but it is non-blocking, which is what makes it fast for I/O-heavy work.

The event loop is the mechanism that allows Node to do non-blocking I/O. When Node encounters an async operation (reading a file, querying a database, making an HTTP request), it offloads the work to the OS (via libuv) and registers a callback. Node continues processing other requests. When the OS signals completion, the callback is placed in the event queue and executed when the call stack is empty.

The loop cycles through phases: timers (setTimeout/setInterval), I/O callbacks, idle/prepare, poll (wait for new I/O), check (setImmediate), close callbacks.

Promise callbacks (microtasks) execute between phases — they have higher priority than the macrotask queue and run before the event loop moves to the next phase.

Node excels at I/O-bound work: web servers, APIs, real-time apps. For CPU-bound work (image processing, encryption, ML inference), use worker_threads to avoid blocking the event loop.`,
        analogy: "A single chef (the event loop) runs a busy restaurant. Instead of waiting at the stove for the pasta to boil, they start the pasta, move on to prep the salad, then answer the kitchen bell when the pasta finishes. They never sit idle — they context-switch, not block.",
        code: `// Demonstrating non-blocking I/O
const fs = require('fs')

console.log('1: Start')

// Non-blocking — Node hands this to the OS and moves on
fs.readFile('huge.txt', 'utf8', (err, data) => {
  console.log('3: File read complete')
})

console.log('2: Still running while file reads')

// Output: 1, 2, 3 (not 1, 3, 2)

// Promise microtasks run before the next event loop phase
setTimeout(() => console.log('setTimeout'), 0)
Promise.resolve().then(() => console.log('Promise'))
// Output: "Promise" then "setTimeout"

// CPU-heavy work — use worker_threads to avoid blocking
import { Worker, isMainThread, parentPort } from 'worker_threads'

if (isMainThread) {
  const worker = new Worker(__filename)
  worker.on('message', result => console.log('Result:', result))
} else {
  // runs in its own thread — doesn't block the event loop
  const result = heavyCpuWork()
  parentPort?.postMessage(result)
}`,
        codeLang: 'javascript',
        tags: ['Node.js'],
      },
      {
        id: 'express-basics',
        title: 'Express.js Fundamentals',
        teaser: 'The minimal, unopinionated web framework for Node.js.',
        explanation: `Express is a thin layer on top of Node's http module. It adds routing (map URL + method to a handler), middleware (run functions before/after handlers), and a cleaner request/response API.

The core object is the Express app. app.use() mounts middleware for all routes. app.get/post/put/patch/delete() handle specific method + path combinations. The router object (express.Router()) lets you group related routes in separate files.

Request object (req): req.params for URL parameters (/users/:id), req.query for query strings (?page=2), req.body for the parsed request body (requires body-parser middleware or express.json()), req.headers for request headers.

Response object (res): res.json() sends a JSON response. res.status(404) sets the status code. res.send() sends a string or Buffer. res.redirect() redirects. Always send exactly one response per request.`,
        code: `import express from 'express'

const app = express()
app.use(express.json())  // parse JSON request bodies

// Basic CRUD routes
app.get('/api/users', async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const users = await db.user.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  })
  res.json({ data: users, page: Number(page) })
})

app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body
  const user = await db.user.create({ data: { name, email } })
  res.status(201).json(user)
})

app.patch('/api/users/:id', async (req, res) => {
  const user = await db.user.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json(user)
})

app.delete('/api/users/:id', async (req, res) => {
  await db.user.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

app.listen(3000, () => console.log('Server running on port 3000'))`,
        codeLang: 'typescript',
        tags: ['Express', 'Node.js'],
      },
      {
        id: 'middleware',
        title: 'Express Middleware',
        teaser: 'Functions that transform requests and responses — the backbone of Express.',
        explanation: `Middleware functions have the signature (req, res, next) and sit in a pipeline. Each middleware can read/modify req and res, then either call next() to pass to the next middleware, or send a response to end the chain.

Order matters: middleware is applied in the order it is registered. app.use() before the routes means all routes inherit it.

Types of middleware: application-level (app.use()), router-level (router.use()), error-handling (4 arguments: err, req, res, next — must be registered after all routes), and built-in (express.json(), express.static()).

Common built-in/popular middleware: cors (Cross-Origin Resource Sharing), helmet (security headers), morgan (HTTP request logging), express-rate-limit (rate limiting), compression (gzip responses), cookie-parser.

Error-handling middleware: if you pass an argument to next(err), Express skips all regular middleware and jumps to the error handler. Always define it with 4 parameters.`,
        code: `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// Global middleware — applied to all routes
app.use(helmet())                    // security headers
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(morgan('combined'))          // request logging
app.use(express.json({ limit: '10mb' }))

// Custom auth middleware — reusable
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    req.userId = payload.sub as string
    next()  // ← pass to next middleware/route handler
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Apply to specific routes
app.use('/api/admin', requireAuth)
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ userId: req.userId })
})

// Error-handling middleware — must have 4 parameters, registered LAST
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
})`,
        codeLang: 'typescript',
        tags: ['Express', 'Node.js'],
      },
      {
        id: 'project-structure',
        title: 'REST API Project Structure',
        teaser: 'How to organise a Node/Express API for maintainability.',
        explanation: `Flat route files become unmanageable fast. Separate concerns into three layers: routes, controllers, and services.

Routes: just the URL + method mapping. No business logic. Call the controller.

Controllers: handle HTTP concerns — parse req, call the service, format and send res. No database calls. Return early on validation failures.

Services: the business logic layer. No knowledge of HTTP (no req/res). Calls the database or external APIs. Reusable across controllers or CLI scripts.

This separation makes each layer testable in isolation: services can be unit-tested without HTTP. Controllers can be tested without a real database. Routes can be integration-tested with a mock service.

Additional files to add: a central error class for consistent error shapes, a Zod validation middleware factory, an env config file that validates environment variables on startup (fail fast rather than crash mid-request).`,
        code: `// src/
// ├── routes/
// │   └── users.ts      ← URL mapping only
// ├── controllers/
// │   └── users.ts      ← HTTP handling
// ├── services/
// │   └── users.ts      ← business logic
// └── app.ts            ← express setup

// routes/users.ts
import { Router } from 'express'
import { getUser, createUser } from '../controllers/users'
import { requireAuth } from '../middleware/auth'

export const usersRouter = Router()
usersRouter.get('/:id', requireAuth, getUser)
usersRouter.post('/', createUser)

// controllers/users.ts
import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/users'

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) { next(err) }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body
    const user = await userService.create({ name, email })
    res.status(201).json(user)
  } catch (err) { next(err) }
}

// services/users.ts — no req/res, pure business logic
import { db } from '../lib/db'
import { hash } from 'bcrypt'

export async function findById(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function create(data: { name: string; email: string }) {
  const existing = await db.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error('Email already registered')
  return db.user.create({ data })
}`,
        codeLang: 'typescript',
        tags: ['Express', 'Architecture'],
      },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: Database,
    topics: [
      {
        id: 'sql-fundamentals',
        title: 'SQL Fundamentals',
        teaser: 'The language for querying and manipulating relational databases.',
        explanation: `SQL (Structured Query Language) is the standard language for relational databases. Every backend developer needs a solid SQL foundation — even when using an ORM.

Core clauses: SELECT picks columns. FROM specifies the table. WHERE filters rows. GROUP BY aggregates rows by a column. HAVING filters groups (like WHERE but for GROUP BY). ORDER BY sorts. LIMIT/OFFSET paginates. DISTINCT removes duplicates.

JOINs: INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table, with nulls for unmatched right table rows. RIGHT JOIN is the reverse. FULL OUTER JOIN returns all rows from both. Self JOIN joins a table with itself.

Aggregate functions: COUNT(), SUM(), AVG(), MAX(), MIN() — work on groups of rows.

Subqueries: a SELECT inside another query. Can appear in WHERE, FROM, or SELECT. Correlated subqueries reference the outer query and run once per row (can be slow — prefer JOINs or CTEs).

CTEs (Common Table Expressions): WITH name AS (SELECT ...) make complex queries readable by naming intermediate results.`,
        code: `-- Basic SELECT with filtering and sorting
SELECT id, name, email, created_at
FROM users
WHERE created_at > NOW() - INTERVAL '30 days'
  AND is_active = true
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- page 3 (0-indexed pages of 20)

-- JOIN: orders with user names
SELECT o.id, o.total, u.name AS customer_name
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending';

-- LEFT JOIN: include users with no orders
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC;

-- CTE for readability
WITH recent_orders AS (
  SELECT user_id, SUM(total) AS total_spent
  FROM orders
  WHERE created_at > NOW() - INTERVAL '90 days'
  GROUP BY user_id
)
SELECT u.name, r.total_spent
FROM users u
JOIN recent_orders r ON u.id = r.user_id
WHERE r.total_spent > 1000;`,
        codeLang: 'sql',
        tags: ['SQL', 'Database'],
      },
      {
        id: 'db-indexing',
        title: 'Database Indexing',
        teaser: 'The single biggest performance optimisation for slow queries.',
        explanation: `Without an index, a query scans every row in the table (full table scan). For a 10 million row table, that's millions of comparisons per query. An index is a separate data structure (usually a B-tree) that lets the database jump directly to matching rows.

When to index: columns used in WHERE clauses, JOIN conditions, ORDER BY, and GROUP BY. Foreign key columns. Columns used in filter combinations frequently (composite index).

When NOT to index: columns with very low cardinality (boolean columns — only 2 distinct values, so an index barely helps). Tables that are written to extremely frequently (every write must also update all indexes). Small tables (full scan is fast enough).

Composite indexes: an index on (column_a, column_b) is useful for queries filtering on column_a alone, or column_a AND column_b together, but not for column_b alone. Order matters. Put the most selective column first.

EXPLAIN ANALYZE is your best tool. It shows whether the query used an index, how many rows were scanned, and where time was spent. Always check it before adding an index — sometimes the query planner doesn't use an index you think it should.`,
        analogy: "An index is like a book's index at the back. Without it, finding 'recursion' means reading every page. With it, you jump straight to page 482.",
        code: `-- Check if a query is doing a full table scan
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';
-- Look for: "Seq Scan" (bad for large tables) vs "Index Scan" (good)

-- Create a single-column index
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index for common filter combination
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Covers: WHERE user_id = ? (uses first column)
-- Covers: WHERE user_id = ? AND status = ? (uses both)
-- Does NOT cover: WHERE status = ? (skips first column)

-- Partial index — only index rows matching a condition
-- Great for "soft delete" tables where you mostly query non-deleted rows
CREATE INDEX idx_users_active ON users(email) WHERE deleted_at IS NULL;

-- Unique index enforces uniqueness
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;  -- rarely-used indexes waste write performance`,
        codeLang: 'sql',
        tags: ['Database', 'Performance'],
      },
      {
        id: 'sql-nosql',
        title: 'SQL vs NoSQL — When to Use Each',
        teaser: 'Relational vs document databases — the trade-offs in plain terms.',
        explanation: `SQL (Relational databases — PostgreSQL, MySQL, SQLite): Data in tables with defined schemas. Relationships enforced by foreign keys. ACID transactions guarantee consistency. Powerful query language. Best for: structured data with clear relationships, financial systems, e-commerce, anything requiring complex reporting or joins.

NoSQL (document, key-value, graph, time-series): Schema-flexible. Horizontal scaling built in. Each type optimised for a specific access pattern. Document stores (MongoDB, Firestore) store JSON-like documents — great for hierarchical data or flexible schemas. Key-value stores (Redis) are ultra-fast for simple lookups. Graph databases (Neo4j) excel at traversing relationships. Time-series databases (InfluxDB, TimescaleDB) optimise for sequential timestamp queries.

CAP theorem: a distributed database can guarantee at most two of: Consistency (every read gets the latest write), Availability (every request gets a response), Partition tolerance (system works despite network failures). SQL databases typically favour CP; many NoSQL systems favour AP.

The practical rule: start with PostgreSQL. It handles 90% of use cases, supports JSON/JSONB for flexibility, and has excellent tooling. Move to a specialised store when you hit a specific bottleneck.`,
        tags: ['Database', 'Architecture'],
      },
      {
        id: 'postgresql',
        title: 'PostgreSQL',
        teaser: 'The most feature-rich open-source relational database — and the right default choice.',
        explanation: `PostgreSQL is a full-featured ACID-compliant relational database that has become the standard choice for new projects. Beyond standard SQL it adds:

JSONB column type: stores JSON as binary, supports GIN indexing for fast key/value lookups inside JSON documents. Gives you document-store flexibility inside a relational database.

Advanced index types: B-tree (default, most use cases), GIN (full-text search, array/JSONB containment), GiST (geospatial, range types), BRIN (very large tables with sequential data like timestamps).

Full-text search: built-in tsvector/tsquery types with ranking. For many apps this eliminates the need for Elasticsearch.

Row-level security: policies that restrict which rows a user can see or modify — useful for multi-tenant apps.

Materialized views: pre-computed query results stored as a table. Refresh periodically for expensive reporting queries.

Extensions: PostGIS (geospatial), pg_vector (vector embeddings for AI), pg_cron (scheduled jobs), uuid-ossp (UUID generation).`,
        code: `-- JSONB column for flexible metadata
CREATE TABLE products (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(10,2) NOT NULL,
  metadata   JSONB,           -- flexible extra attributes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GIN index for fast JSONB queries
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);

-- Query inside JSONB
SELECT name, metadata->>'color' AS color
FROM products
WHERE metadata @> '{"inStock": true}'  -- contains operator
  AND metadata->'sizes' ? 'L';         -- array contains 'L'

-- Full-text search
ALTER TABLE products ADD COLUMN search_vector TSVECTOR;
CREATE INDEX idx_products_fts ON products USING GIN(search_vector);

UPDATE products SET search_vector = to_tsvector('english', name);

SELECT name FROM products
WHERE search_vector @@ plainto_tsquery('english', 'wireless headphones')
ORDER BY ts_rank(search_vector, plainto_tsquery('english', 'wireless headphones')) DESC;

-- Window functions for analytics
SELECT
  user_id,
  order_date,
  total,
  SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) AS running_total,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rank_by_value
FROM orders;`,
        codeLang: 'sql',
        tags: ['Database', 'PostgreSQL'],
      },
      {
        id: 'mongodb',
        title: 'MongoDB',
        teaser: 'Document database — store JSON-like objects, schema-flexible, horizontal by design.',
        explanation: `MongoDB stores data as BSON documents (binary JSON) in collections. Unlike a relational table, documents in a collection don't need to have the same fields. This flexibility is both a feature and a footgun — it's easy to end up with inconsistent data.

Collections are like tables, documents are like rows, but documents are nested objects not flat rows. You can embed related data directly in a document instead of joining across tables.

CRUD: db.collection.insertOne/insertMany, findOne/find, updateOne/updateMany, deleteOne/deleteMany. Queries use the MongoDB query language — a JSON-like filter object.

Aggregation pipeline: $match (filter), $group (aggregate), $project (reshape), $lookup (left join), $sort, $limit, $unwind (flatten arrays). Equivalent to SQL's SELECT with JOINs and GROUP BY.

When MongoDB shines: hierarchical data (comments with nested replies), rapidly evolving schemas during early development, write-heavy workloads with horizontal sharding, when the document model maps naturally to your data.

When to avoid it: complex many-to-many relationships (embed vs reference is always awkward), financial data needing strict ACID transactions across documents, complex reporting with many joins.`,
        code: `// Mongoose ODM (TypeScript)
import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  name: string
  email: string
  posts: Array<{ title: string; content: string; createdAt: Date }>
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, index: true },
  posts:     [{ title: String, content: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUser>('User', UserSchema)

// CRUD
const user = await User.create({ name: 'Rithvik', email: 'r@example.com' })
const found = await User.findOne({ email: 'r@example.com' }).lean()
await User.updateOne({ _id: user._id }, { $set: { name: 'Updated' } })
await User.deleteOne({ _id: user._id })

// Aggregation pipeline
const stats = await User.aggregate([
  { $match: { createdAt: { $gte: new Date('2024-01-01') } } },
  { $group: { _id: null, total: { $sum: 1 }, avgPosts: { $avg: { $size: '$posts' } } } },
])`,
        codeLang: 'typescript',
        tags: ['Database', 'MongoDB'],
      },
      {
        id: 'prisma',
        title: 'Prisma ORM',
        teaser: 'Type-safe database client for Node.js — define schema once, get a typed query builder.',
        explanation: `Prisma is a next-generation ORM with three main components: Prisma Schema (schema.prisma) defines your data model. Prisma Client is the auto-generated, fully typed database client. Prisma Migrate generates and runs SQL migration files from schema changes.

Type safety flows from the schema. When you query a user, TypeScript knows exactly which fields exist, which are nullable, and what types they are. No type assertions needed.

Relations in Prisma: define them in the schema with @relation — Prisma handles the JOIN SQL for you. Nested writes let you create a user with their posts in one operation.

Transactions: prisma.$transaction([...]) for multiple operations that must succeed or fail together. Interactive transactions ($transaction(async (tx) => {...})) for when you need to read before writing.

Prisma Accelerate: connection pooling + query caching at the edge (useful when serverless functions create many short-lived database connections).`,
        code: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}

// npx prisma migrate dev --name add_posts
// npx prisma generate

// Queries — fully typed
const user = await prisma.user.create({
  data: {
    email: 'r@example.com',
    name: 'Rithvik',
    posts: {
      create: [{ title: 'First Post', content: 'Hello world' }]
    }
  },
  include: { posts: true }
})

const posts = await prisma.post.findMany({
  where: { published: true, author: { name: { contains: 'Rith' } } },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 20,
})

// Transaction
await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { name: 'New Name' } }),
  prisma.post.updateMany({ where: { authorId: id }, data: { published: false } }),
])`,
        codeLang: 'typescript',
        tags: ['Database', 'ORM'],
      },
    ],
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: ShieldCheck,
    topics: [
      {
        id: 'jwt-node',
        title: 'JWT Authentication in Node.js',
        teaser: 'Stateless token auth — sign on login, verify on every protected request.',
        explanation: `JWT (JSON Web Token) authentication is stateless: the server issues a signed token at login; subsequent requests send the token and the server verifies the signature — no database lookup or session store needed.

Token storage: httpOnly cookies are more secure than localStorage. JavaScript cannot access httpOnly cookies, so XSS attacks cannot steal them. localStorage is simpler to implement but vulnerable to XSS. If you use localStorage, ensure robust Content Security Policy and sanitize all user-generated content.

Access tokens should be short-lived (15 minutes to 1 hour). Refresh tokens are long-lived (7–30 days) and used only to issue new access tokens. Store refresh tokens in httpOnly cookies and a database so they can be revoked.

The JWT secret must be strong and secret. For RS256, use a private key to sign and the public key to verify — useful when multiple services need to verify tokens without sharing the signing secret.`,
        code: `import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET  = process.env.JWT_SECRET!
const JWT_EXPIRES = '15m'

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )

  // httpOnly cookie — JS cannot read it (XSS-safe)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,  // 15 minutes in ms
  })

  res.json({ user: { id: user.id, name: user.name, role: user.role } })
})

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken
    ?? req.headers.authorization?.replace('Bearer ', '')

  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.userId = payload.sub as string
    req.userRole = payload.role
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' })
    }
    res.status(401).json({ error: 'Invalid token' })
  }
}`,
        codeLang: 'typescript',
        tags: ['Auth'],
      },
      {
        id: 'bcrypt',
        title: 'Password Hashing with bcrypt',
        teaser: 'Never store plain-text passwords — always hash with a slow, salted algorithm.',
        explanation: `Plain-text or weakly-hashed passwords are a liability: if your database is compromised, all users' passwords are immediately exposed.

bcrypt is the standard for password hashing. It is intentionally slow (configurable cost factor), generates a random salt per hash (so identical passwords produce different hashes), and includes the salt in the hash string — no separate storage needed.

The cost factor (work factor) controls how slow the hash is. Higher cost = more CPU time = harder to brute-force. Current recommendation: 10–12. Each increment roughly doubles computation time. Test on your production hardware — a hash taking 250ms is a good target.

Never: MD5, SHA-1, SHA-256 alone for passwords. These are fast hashing functions — an attacker can compute billions per second with a GPU. bcrypt/Argon2/scrypt are designed to be slow.

Argon2 is the modern alternative and winner of the Password Hashing Competition. Use it if your stack supports it (argon2 npm package). bcrypt is still perfectly fine and more widely supported.`,
        code: `import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12  // cost factor — adjust based on hardware benchmarks

// Registration — hash before storing
async function registerUser(email: string, plainPassword: string) {
  // Validate password strength before hashing
  if (plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS)
  // bcrypt.hash includes a unique random salt — every call produces different output
  // e.g. "$2b$12$abc123..." — the $12$ is the cost factor, embedded in the string

  return db.user.create({ data: { email, passwordHash } })
}

// Login — compare provided password against stored hash
async function verifyPassword(plainPassword: string, storedHash: string) {
  return bcrypt.compare(plainPassword, storedHash)
  // bcrypt extracts the salt from storedHash automatically
  // Returns true only if the hash matches
}

// Timing attack prevention: always call bcrypt.compare even if user not found
// (to prevent timing-based user enumeration)
async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  const DUMMY_HASH = '$2b$12$dummy.hash.to.prevent.timing.attacks.xxxxxx'
  const isValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !isValid) throw new Error('Invalid credentials')
  return user
}`,
        codeLang: 'typescript',
        tags: ['Auth', 'Security'],
      },
      {
        id: 'oauth',
        title: 'OAuth 2.0 Implementation',
        teaser: '"Sign in with Google/GitHub" — how OAuth 2.0 works and how to implement it.',
        explanation: `OAuth 2.0 is an authorization framework that lets users grant your app access to their data on another service (Google, GitHub, Facebook) without sharing their password.

The four roles: Resource Owner (the user), Client (your app), Authorization Server (Google/GitHub — issues tokens), Resource Server (the API that has the user's data).

Authorization Code + PKCE flow (the correct flow for web apps): (1) your app redirects the user to Google's auth page with your client_id and a code_challenge. (2) User logs into Google and approves your app. (3) Google redirects back to your callback URL with an authorization code. (4) Your server exchanges the code for an access token and ID token. (5) You use the access token to call Google APIs or extract user info from the ID token.

For most apps: use a library. NextAuth.js for Next.js, Passport.js for Express, or a managed provider (Auth0, Supabase Auth, Clerk). OAuth implementation has many subtle security requirements — rolling your own from scratch is error-prone.`,
        code: `// NextAuth.js — the easiest way to add OAuth to Next.js
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to the session
      session.user.id = token.sub!
      return session
    },
    async signIn({ user, account }) {
      // Create user in your DB on first sign-in
      await db.user.upsert({
        where: { email: user.email! },
        update: {},
        create: { email: user.email!, name: user.name! },
      })
      return true  // allow sign-in
    },
  },
})

export { handler as GET, handler as POST }

// Client component — sign in / sign out
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

function AuthButton() {
  const { data: session } = useSession()
  if (session) return <button onClick={() => signOut()}>Sign out</button>
  return <button onClick={() => signIn('google')}>Sign in with Google</button>
}`,
        codeLang: 'typescript',
        tags: ['Auth'],
      },
      {
        id: 'refresh-tokens',
        title: 'Refresh Token Rotation',
        teaser: 'Keep users logged in securely with short-lived access tokens and rotating refresh tokens.',
        explanation: `The problem: long-lived access tokens are convenient but dangerous — a stolen token is valid until it expires. Short-lived tokens (15 min) limit the damage window but force users to log in constantly.

The solution: two-token system. Access token: short-lived (15 min–1 hour), sent with every API request. Refresh token: long-lived (7–30 days), used only to get a new access token, stored in an httpOnly cookie.

Refresh token rotation: every time the client uses a refresh token, issue a new refresh token and invalidate the old one. Store valid refresh tokens in the database. If an old refresh token is used (possible replay attack), invalidate the entire refresh token family.

The flow: (1) Access token expires → client gets 401. (2) Client calls POST /api/auth/refresh with the refresh token cookie. (3) Server verifies refresh token exists in DB, issues new access token + new refresh token, invalidates old refresh token. (4) Client retries the original request with the new access token.`,
        code: `// Database table for refresh tokens
// CREATE TABLE refresh_tokens (
//   token      TEXT PRIMARY KEY,
//   user_id    TEXT REFERENCES users(id),
//   family     TEXT NOT NULL,   -- detect replay attacks across rotations
//   expires_at TIMESTAMPTZ NOT NULL,
//   used       BOOLEAN DEFAULT false
// );

async function issueTokenPair(userId: string, family = crypto.randomUUID()) {
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '15m' })

  const refreshToken = crypto.randomUUID()
  await db.refreshToken.create({
    data: { token: refreshToken, userId, family, expiresAt: addDays(new Date(), 30) }
  })

  return { accessToken, refreshToken }
}

// POST /api/auth/refresh
app.post('/api/auth/refresh', async (req, res) => {
  const incomingToken = req.cookies.refreshToken
  if (!incomingToken) return res.status(401).json({ error: 'No refresh token' })

  const stored = await db.refreshToken.findUnique({ where: { token: incomingToken } })

  // Detect replay attack — token was already used
  if (!stored || stored.used || stored.expiresAt < new Date()) {
    if (stored?.used) {
      // Possible token theft — invalidate entire family
      await db.refreshToken.deleteMany({ where: { family: stored.family } })
    }
    return res.status(401).json({ error: 'Invalid refresh token' })
  }

  // Mark old token as used
  await db.refreshToken.update({ where: { token: incomingToken }, data: { used: true } })

  // Issue new pair
  const { accessToken, refreshToken } = await issueTokenPair(stored.userId, stored.family)

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' })
  res.json({ accessToken })
})`,
        codeLang: 'typescript',
        tags: ['Auth', 'Security'],
      },
    ],
  },
  {
    id: 'security',
    label: 'Security & Validation',
    icon: Lock,
    topics: [
      {
        id: 'zod',
        title: 'Zod Validation',
        teaser: 'TypeScript-first schema validation — parse and validate untrusted input at your API boundary.',
        explanation: `Never trust input from the outside world: request bodies, query parameters, environment variables, external API responses. Validate everything at the boundary.

Zod is a TypeScript-first schema library. You define a schema once and use it for both runtime validation and TypeScript type inference — no duplication.

z.parse() throws a ZodError with detailed field-level messages if validation fails. z.safeParse() returns { success, data, error } and never throws — better for API handlers where you want to return a 400 response rather than crash.

z.infer<typeof Schema> extracts the TypeScript type from a schema — write the schema once and get the type for free.

Common integration pattern: a validateBody(schema) middleware factory that validates req.body and either passes a typed body to the next handler or returns a 422 response with field errors.`,
        code: `import { z } from 'zod'

// Define schema
const CreateUserSchema = z.object({
  name:     z.string().min(1, 'Name required').max(100),
  email:    z.string().email('Invalid email'),
  age:      z.number().int().min(18).optional(),
  role:     z.enum(['user', 'admin']).default('user'),
  password: z.string().min(8).regex(/[A-Z]/, 'Must include uppercase'),
})

// Infer the TypeScript type from the schema — no duplication
type CreateUserData = z.infer<typeof CreateUserSchema>

// In an Express route
app.post('/api/users', async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(422).json({
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
      // { name: ['Name required'], email: ['Invalid email'] }
    })
  }

  // result.data is fully typed as CreateUserData
  const user = await userService.create(result.data)
  res.status(201).json(user)
})

// Reusable validation middleware factory
function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(422).json({ error: result.error.flatten() })
    }
    req.body = result.data  // replace with parsed + coerced data
    next()
  }
}

app.post('/api/posts', validateBody(CreateUserSchema), createPostHandler)`,
        codeLang: 'typescript',
        tags: ['Security', 'Validation'],
      },
      {
        id: 'xss-csrf',
        title: 'XSS & CSRF Attacks',
        teaser: 'The two most common web vulnerabilities — what they are and how to prevent them.',
        explanation: `XSS (Cross-Site Scripting): an attacker injects malicious JavaScript into your page. When other users view the page, the script runs in their browser with access to their cookies, localStorage, and can make requests on their behalf.

Types: Stored XSS (injected into the database, shown to all visitors), Reflected XSS (in URL parameters echoed in the response), DOM-based XSS (client-side code unsafely writes to the DOM).

XSS prevention: sanitize all user-generated content before rendering. Never use innerHTML or dangerouslySetInnerHTML with user content. Use libraries like DOMPurify when HTML content is needed. Set a strict Content Security Policy (CSP) header. Use httpOnly cookies so JavaScript cannot access session tokens.

CSRF (Cross-Site Request Forgery): a malicious site tricks an authenticated user's browser into making a request to your API. Because the request comes from the user's browser, it automatically includes their cookies.

CSRF prevention: SameSite=Lax or SameSite=Strict cookie attribute prevents cookies from being sent on cross-site requests. CSRF tokens (double-submit pattern) are the traditional defense. Check the Origin/Referer header on state-changing requests. Next.js Server Actions handle CSRF protection automatically.`,
        code: `// XSS Prevention

// ❌ Unsafe — raw HTML from user content renders injected scripts
function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}

// ✅ Safe — React escapes by default
function Comment({ text }: { text: string }) {
  return <div>{text}</div>
}

// ✅ When HTML IS needed — sanitize with DOMPurify
import DOMPurify from 'dompurify'
function RichContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'a', 'p'] })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}

// CSP Header (Express/Helmet) — restricts where scripts can load from
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'"],  // no inline scripts, no external JS
    styleSrc:   ["'self'", "'unsafe-inline'"],
    imgSrc:     ["'self'", 'data:', 'https:'],
  },
}))

// CSRF Prevention with SameSite cookie
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',    // blocks cross-site POST requests from carrying cookie
})

// SQL Injection Prevention — always use parameterized queries
// ❌ String interpolation — NEVER do this
const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`)

// ✅ Parameterized (Prisma, pg, or any driver does this for you)
const user = await db.user.findUnique({ where: { email } })
// or with raw SQL:
const user = await db.$queryRaw\`SELECT * FROM users WHERE email = \${email}\``,
        codeLang: 'typescript',
        tags: ['Security'],
      },
      {
        id: 'api-security',
        title: 'API Security Best Practices',
        teaser: 'A checklist of security measures beyond authentication.',
        explanation: `Authentication verifies identity. Security goes much further.

Input validation: validate every field at the API boundary with Zod or Joi. Reject unexpected fields. Set limits on string lengths and array sizes to prevent memory exhaustion.

Rate limiting: prevent brute-force attacks and abuse. Apply globally with express-rate-limit, and apply stricter limits to auth endpoints (e.g., 5 login attempts per 15 minutes per IP).

Security headers via Helmet.js: X-Frame-Options (clickjacking), X-Content-Type-Options (MIME sniffing), Strict-Transport-Security (force HTTPS), Referrer-Policy. One line with helmet().

HTTPS everywhere: never serve secrets over HTTP. In production, force redirects from HTTP to HTTPS. Set Strict-Transport-Security with a long max-age.

Principle of least privilege: database users should only have SELECT/INSERT/UPDATE/DELETE on the tables they need — never DROP TABLE or CREATE DATABASE. API keys should have the narrowest scope possible.

Dependency security: run npm audit regularly. Use Snyk or GitHub Dependabot for automated vulnerability alerts. Avoid unmaintained packages with known CVEs.

Never log secrets: no logging of passwords, tokens, credit card numbers, or full request bodies with sensitive fields.`,
        code: `import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

// 1. Security headers
app.use(helmet())

// 2. Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,      // send RateLimit-* headers
  message: { error: 'Too many requests, try again later' },
}))

// 3. Stricter limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // only 5 login attempts per IP per 15 min
  skipSuccessfulRequests: true,
})
app.post('/api/auth/login', authLimiter, loginHandler)

// 4. Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, \`https://\${req.hostname}\${req.url}\`)
  }
  next()
})

// 5. Never log sensitive fields
const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const { password, token, creditCard, ...safeBody } = req.body
  console.log({ method: req.method, url: req.url, body: safeBody })
  next()
}`,
        codeLang: 'typescript',
        tags: ['Security'],
      },
    ],
  },
  {
    id: 'system-design',
    label: 'System Design',
    icon: Network,
    topics: [
      {
        id: 'url-to-page',
        title: 'What Happens When You Type a URL',
        teaser: 'The classic interview question — every step from browser to server and back.',
        explanation: `This is the most common system design warm-up question. Know every step.

1. Browser cache check: browser first checks its local cache for a cached response.

2. DNS resolution: converts example.com to an IP. Cache chain: browser → OS → router → ISP recursive resolver → root nameserver → TLD nameserver (.com) → authoritative nameserver for example.com. Returns the A record (IPv4) or AAAA record (IPv6).

3. TCP connection: three-way handshake (SYN, SYN-ACK, ACK) to establish a reliable connection on port 443.

4. TLS handshake: client hello → server certificate (public key + CA signature) → browser verifies against trusted CA list → session keys exchanged → encrypted channel established.

5. HTTP request: GET / HTTP/1.1 with headers including Host, Accept-Language, Cookie, Referer. HTTP/2 multiplexes multiple requests over the same connection. HTTP/3 uses QUIC (UDP-based) for lower latency.

6. Server processing: DNS may point to a load balancer → API gateway → application server → database query → response assembled.

7. Response: HTML is returned. Browser parses HTML → discovers linked CSS/JS/fonts → makes parallel requests → DOM + CSSOM built → render tree → layout → paint → composite.`,
        tags: ['System Design'],
      },
      {
        id: 'load-balancers',
        title: 'Load Balancers',
        teaser: 'Distribute traffic across multiple servers to handle scale and ensure availability.',
        explanation: `A load balancer sits in front of your servers and distributes incoming requests. Without one, a single server is a single point of failure and a bottleneck.

Algorithms: Round Robin (send each new request to the next server in rotation — simple, works when servers are identical). Least Connections (send to the server with fewest active connections — better when requests vary in duration). IP Hash (always send the same client IP to the same server — sticky sessions without a session store, but loses even distribution if a server goes down). Weighted Round Robin (send more requests to more powerful servers).

Health checks: the load balancer pings servers periodically. If a server fails health checks, it's removed from rotation until it recovers. This is what makes zero-downtime deploys possible.

Layer 4 vs Layer 7: Layer 4 load balancers work at the transport level (TCP/UDP) — fast, low overhead. Layer 7 load balancers inspect HTTP — can route based on URL path, headers, or cookies. Can do SSL termination, content-based routing, A/B testing.

Popular tools: AWS ALB/NLB, Nginx, HAProxy, Cloudflare.`,
        analogy: "A load balancer is like a host at a restaurant who seats guests at whichever tables are available, ensuring no single waiter is overwhelmed while others stand idle.",
        code: `# Nginx as a Layer 7 load balancer
upstream backend {
  least_conn;  # route to server with fewest connections

  server app1.internal:3000 weight=3;  # gets 3x more traffic (more powerful)
  server app2.internal:3000 weight=1;
  server app3.internal:3000 backup;    # only used if others are down

  keepalive 32;  # persistent connections to backends
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # Health check — remove server if it fails
    proxy_connect_timeout 2s;
    proxy_read_timeout    10s;
  }
}`,
        codeLang: 'nginx',
        tags: ['System Design', 'Infrastructure'],
      },
      {
        id: 'cdn',
        title: 'CDN (Content Delivery Network)',
        teaser: 'Cache static assets at edge servers worldwide, close to your users.',
        explanation: `A CDN is a distributed network of servers (edge nodes) in data centres worldwide. Instead of every user's request travelling to your origin server (possibly on the other side of the world), they hit the nearest edge node, which serves a cached copy.

What to cache: static assets (JS, CSS, images, fonts), API responses that are the same for all users (public product listings, blog posts), and anything served by your Next.js static routes.

Cache-Control headers control CDN behaviour: Cache-Control: public, max-age=31536000, immutable for fingerprinted assets that never change. Cache-Control: public, max-age=0, must-revalidate for HTML pages that should always be fresh.

Cache invalidation: CDNs cache aggressively. To force an update: fingerprint asset filenames (app.a1b2c3.js) so a new deploy gets a new URL. Or call the CDN's purge API after a deploy.

Beyond static files: edge computing (Cloudflare Workers, Vercel Edge Functions) runs your code at edge nodes too. Response times drop from 200ms to 20ms for compute-heavy requests. Next.js App Router with Edge Runtime uses this.

Popular CDNs: Cloudflare (best free tier, DDoS protection), AWS CloudFront, Fastly, Vercel Edge Network.`,
        tags: ['System Design', 'Performance'],
      },
      {
        id: 'caching-redis',
        title: 'Caching Strategies & Redis',
        teaser: 'Store frequently accessed data in memory to avoid repeated database queries.',
        explanation: `Caching dramatically reduces database load and response times. A database query taking 50ms becomes a Redis lookup taking 0.1ms.

Cache-aside (lazy loading): application checks cache first. On cache miss, fetch from DB, store in cache, return. On cache hit, return cached data. Simplest and most common pattern.

Write-through: on every database write, also write to cache. Cache is always warm. Downside: every write hits both DB and cache.

Write-behind (write-back): write to cache immediately, asynchronously flush to DB. Lower write latency, but risk of data loss if cache fails before flushing.

Cache invalidation: the hard part. When data changes, the cache must be invalidated or updated. Strategies: TTL expiry (simple, eventually consistent), event-driven invalidation (delete cache key when data changes — consistent but more complex).

Redis use cases: session storage, rate limiting counters, distributed locks, leaderboards (sorted sets), pub/sub message broker, queue (via Redis Streams or Bull/BullMQ).`,
        code: `import { Redis } from 'ioredis'
const redis = new Redis(process.env.REDIS_URL!)

// Cache-aside pattern with TTL
async function getUser(id: string) {
  const cacheKey = \`user:\${id}\`
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)  // cache hit

  const user = await db.user.findUnique({ where: { id } })  // cache miss
  if (user) {
    await redis.setex(cacheKey, 3600, JSON.stringify(user))  // cache 1 hour
  }
  return user
}

// Invalidate on update
async function updateUser(id: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id }, data })
  await redis.del(\`user:\${id}\`)  // bust the cache
  return user
}

// Rate limiting counter in Redis
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = \`rate:\${ip}:\${Math.floor(Date.now() / 60000)}\`  // per minute
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60)  // set TTL on first request
  return count <= 100  // true = allowed
}

// Distributed lock (prevent race conditions across multiple servers)
async function acquireLock(resource: string, ttlMs = 5000) {
  const result = await redis.set(\`lock:\${resource}\`, '1', 'PX', ttlMs, 'NX')
  return result === 'OK'  // NX = only set if not exists
}`,
        codeLang: 'typescript',
        tags: ['System Design', 'Redis', 'Performance'],
      },
      {
        id: 'db-scaling',
        title: 'Database Scaling',
        teaser: 'What to do when your database becomes the bottleneck.',
        explanation: `The database is almost always the first bottleneck as an app scales. Go through these steps in order — each adds complexity.

Step 1: Optimise queries. Run EXPLAIN ANALYZE on slow queries. Add missing indexes. Rewrite N+1 queries. This is often enough.

Step 2: Add a connection pool. Serverless functions and microservices create many short-lived DB connections. PgBouncer (for Postgres) pools connections, reusing a smaller set of actual DB connections. Prisma Accelerate does this at the edge.

Step 3: Read replicas. Add replica nodes that receive write-ahead log from the primary. Read requests (GET endpoints) go to replicas; writes go to the primary. Most apps have a 90/10 read/write split — replicas dramatically increase read throughput.

Step 4: Caching layer. Put Redis in front of the database for hot-path reads.

Step 5: Vertical scaling. Upgrade to a bigger DB instance (more CPU, more RAM). Fast, zero code change, but has limits and single point of failure.

Step 6: Sharding (horizontal partitioning). Split the data across multiple database servers by a shard key (e.g., user_id % N). Each shard handles a subset of the data. Cross-shard queries become complex. Only do this when you truly need it — Postgres with read replicas handles millions of users.`,
        tags: ['System Design', 'Database'],
      },
      {
        id: 'monolith-vs-microservices',
        title: 'Monolith vs Microservices',
        teaser: 'Start with a monolith. Break it apart only when you have a good reason.',
        explanation: `Monolith: all functionality in one deployable unit. One codebase, one database, one deployment. Simple to develop, test, debug, and deploy. No network latency between components. The right choice for most early-stage products and small teams.

Microservices: decompose the application into independently deployable services, each owning its data and communicating via HTTP or message queues. Each service can be deployed, scaled, and updated independently. Different teams can work on different services. Different services can use different languages and databases.

The hidden cost of microservices: distributed systems are fundamentally harder. Network calls fail. Services are unavailable. You need service discovery, distributed tracing, circuit breakers, API gateways, message queues. Debugging a bug that spans 5 services is much harder than debugging a monolith. Testing requires spinning up multiple services.

When to split a monolith: when different parts need vastly different scaling characteristics (e.g., a video processing service needs more CPU than the auth service). When different teams frequently conflict in the same codebase (Conway's Law). When a part of the system needs a different tech stack. When you have more than 30–50 engineers.

Start with a well-structured monolith with clear internal module boundaries. Extract services when you have a concrete scaling or organisational need.`,
        analogy: "A monolith is a single restaurant with all stations (kitchen, bar, desserts) under one roof — easy to coordinate. Microservices are a food court — each stall independent, but coordinating a complex order across multiple stalls is harder.",
        tags: ['System Design', 'Architecture'],
      },
      {
        id: 'system-design-approach',
        title: 'System Design Interview Approach',
        teaser: 'A framework for tackling any system design question.',
        explanation: `System design interviews are open-ended — there is no single correct answer. The interviewer wants to see how you think through trade-offs.

Step 1 — Clarify requirements (5 min): Functional requirements: what does the system do? (users can post tweets, others can follow them). Non-functional requirements: scale (how many daily active users?), latency targets (p99 under 100ms?), consistency vs availability trade-off, storage estimates.

Step 2 — Estimate scale (2 min): Daily active users → requests per second → storage per day → bandwidth. This determines if you need one server or a fleet.

Step 3 — High-level design (10 min): Draw the major components: clients, load balancer, API servers, cache, database, CDN, message queue, external services. Don't go deep yet.

Step 4 — Deep dive (15 min): pick the most interesting/challenging component and go deep. Database schema. Caching strategy. How you handle hot spots. How you scale reads vs writes. Where you make trade-offs.

Step 5 — Address bottlenecks (5 min): proactively call out where the system will fail and how you'd fix it. Shows you can think ahead.

Common patterns: read-heavy systems → read replicas + caching. Write-heavy → message queues, sharding, eventual consistency. Low latency → CDN, edge computing, in-memory cache.`,
        tags: ['System Design', 'Interviews'],
      },
    ],
  },
]

function TopicCard({ topic }: { topic: TopicCard }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-2xl bg-surface overflow-hidden transition-all duration-200 hover:border-indigo/30">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-text">{topic.title}</span>
            {topic.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-dim text-indigo-light border border-indigo/20">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-muted">{topic.teaser}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-text-dim">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="pt-4 space-y-4">
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{topic.explanation}</p>

            {topic.analogy && (
              <div className="border border-indigo/30 bg-indigo-dim rounded-xl px-4 py-3">
                <p className="text-[11px] font-mono text-indigo-light uppercase tracking-widest mb-1">Analogy</p>
                <p className="text-sm text-text-muted leading-relaxed">{topic.analogy}</p>
              </div>
            )}

            {topic.code && (
              <div>
                <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  {topic.codeLang?.toUpperCase() ?? 'CODE'}
                </p>
                <pre className="bg-bg border border-border rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-text-muted">
                  <code>{topic.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BackendPage() {
  const [activeCategory, setActiveCategory] = useState('nodejs')
  const current = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Backend Development"
        subtitle="Node.js, Express, SQL/NoSQL databases, authentication, API security, and system design fundamentals."
      />

      <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap gap-2 bg-bg">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer focus:outline-none ${
                isActive
                  ? 'bg-indigo text-white'
                  : 'bg-surface border border-border text-text-muted hover:text-text hover:border-border-hover'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
              <span className={`text-[10px] font-mono ml-0.5 ${isActive ? 'text-white/70' : 'text-text-dim'}`}>
                {cat.topics.length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl w-full">
        <div className="space-y-3">
          {current.topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  )
}
