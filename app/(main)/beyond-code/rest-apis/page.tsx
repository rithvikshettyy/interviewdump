'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  Globe,
  Zap,
  Shield,
  Layers,
  Wrench,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import ReadAloudButton from '@/components/shared/ReadAloudButton'

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Content ──────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'basics',
    label: 'Basics',
    icon: BookOpen,
    topics: [
      {
        id: 'what-api',
        title: 'What is an API?',
        teaser: 'The contract between two software systems.',
        explanation:
          'API stands for Application Programming Interface. It is a defined contract that lets two software systems talk to each other. One system (the client) makes a request; the other system (the server) sends back a response. APIs hide the internal complexity of a system and expose only what the caller needs.',
        analogy:
          'A waiter in a restaurant is an API. You (the client) don\'t go into the kitchen. You tell the waiter what you want, the kitchen (server) prepares it, and the waiter brings it back. You never need to know how the kitchen works.',
        tags: ['Fundamentals'],
      },
      {
        id: 'what-rest',
        title: 'What is REST?',
        teaser: 'An architectural style for building APIs over HTTP.',
        explanation:
          'REST (Representational State Transfer) is an architectural style defined by Roy Fielding in 2000. It is not a protocol or standard — it is a set of constraints for how web APIs should behave. A REST API uses HTTP as its transport, treats everything as a "resource" identified by a URL, and transfers representations of those resources (usually JSON) between client and server.',
        analogy:
          'Think of REST as the traffic rules of the web API world. Just as traffic rules don\'t mandate what cars look like but define how they should behave on the road, REST defines how API endpoints should behave without dictating the programming language or framework.',
        tags: ['Fundamentals'],
      },
      {
        id: 'http-methods',
        title: 'HTTP Methods',
        teaser: 'GET, POST, PUT, PATCH, DELETE — what each one means.',
        explanation:
          'HTTP methods (also called verbs) tell the server what action to perform on a resource.\n\n• GET — Read a resource. No body. Safe & idempotent. Example: GET /users/42\n• POST — Create a new resource. Has a body. Not idempotent. Example: POST /users\n• PUT — Replace a resource entirely. Has a body. Idempotent. Example: PUT /users/42\n• PATCH — Partially update a resource. Has a body. Example: PATCH /users/42\n• DELETE — Remove a resource. No body. Idempotent. Example: DELETE /users/42\n\nIdempotent means calling the operation multiple times produces the same result as calling it once.',
        code: `// GET — fetch a user
fetch('/api/users/42')

// POST — create a user
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Rithvik', role: 'developer' })
})

// PATCH — update only the role field
fetch('/api/users/42', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'senior developer' })
})

// DELETE
fetch('/api/users/42', { method: 'DELETE' })`,
        codeLang: 'javascript',
        tags: ['HTTP'],
      },
      {
        id: 'status-codes',
        title: 'HTTP Status Codes',
        teaser: 'The server\'s one-number verdict on your request.',
        explanation:
          'Status codes are 3-digit numbers grouped by the first digit:\n\n2xx — Success\n• 200 OK — request succeeded\n• 201 Created — resource was created (use after POST)\n• 204 No Content — success but no body (use after DELETE)\n\n3xx — Redirection\n• 301 Moved Permanently, 302 Found (temporary redirect)\n\n4xx — Client errors (your fault)\n• 400 Bad Request — malformed request / validation failed\n• 401 Unauthorized — not authenticated (no/bad token)\n• 403 Forbidden — authenticated but not allowed\n• 404 Not Found — resource doesn\'t exist\n• 409 Conflict — resource state conflict (e.g. duplicate email)\n• 422 Unprocessable Entity — semantically invalid data\n• 429 Too Many Requests — rate limit hit\n\n5xx — Server errors (their fault)\n• 500 Internal Server Error — unexpected crash\n• 502 Bad Gateway — upstream service failed\n• 503 Service Unavailable — server overloaded or down',
        tags: ['HTTP'],
      },
      {
        id: 'request-response',
        title: 'Request & Response Structure',
        teaser: 'What actually travels over the wire.',
        explanation:
          'Every HTTP request has:\n• Method (GET, POST, etc.)\n• URL (the resource address)\n• Headers (metadata: Content-Type, Authorization, Accept…)\n• Query Parameters (?page=1&limit=20 — appended to URL, for filtering/pagination)\n• Path Parameters (/users/:id — part of the URL path)\n• Body (JSON, form data — only for POST/PUT/PATCH)\n\nEvery HTTP response has:\n• Status Code\n• Headers (Content-Type, Cache-Control, Set-Cookie…)\n• Body (JSON, HTML, binary…)',
        code: `// Full request anatomy
GET /api/users/42?include=posts HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGci...
Accept: application/json
Content-Type: application/json

// Full response anatomy
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{
  "id": 42,
  "name": "Rithvik",
  "role": "developer",
  "posts": [...]
}`,
        codeLang: 'http',
        tags: ['HTTP'],
      },
      {
        id: 'json-basics',
        title: 'JSON Format',
        teaser: 'The universal language of REST APIs.',
        explanation:
          'JSON (JavaScript Object Notation) is the de-facto format for REST API payloads. It is human-readable, language-agnostic, and natively supported by JavaScript.\n\nJSON supports: strings, numbers, booleans, null, objects ({}), and arrays ([]).\n\nKey rules:\n• Keys must be double-quoted strings\n• No trailing commas\n• No comments\n• Dates are strings (ISO 8601: "2024-01-15T10:30:00Z")\n• Large integers can lose precision — use strings for IDs over 53 bits',
        code: `{
  "id": "usr_42",
  "name": "Rithvik Shetty",
  "age": 22,
  "isPremium": false,
  "tags": ["developer", "fullstack"],
  "address": {
    "city": "Bangalore",
    "country": "India"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "deletedAt": null
}`,
        codeLang: 'json',
        tags: ['Data'],
      },
    ],
  },
  {
    id: 'principles',
    label: 'REST Principles',
    icon: Layers,
    topics: [
      {
        id: 'statelessness',
        title: 'Statelessness',
        teaser: 'Every request must carry everything the server needs.',
        explanation:
          'The server stores zero session state between requests. Each HTTP request must contain all information required to understand and process it — authentication token, context, everything. The server processes it and forgets.\n\nWhy: Horizontal scaling becomes trivial. Any server instance can handle any request because none of them hold client state. Load balancers can route freely.\n\nWhat this means in practice: Instead of server-side sessions, use tokens (JWT) that the client sends with every request.',
        analogy:
          'Like calling a help desk where every agent can answer your call. You must introduce yourself and explain your problem every time — the agent doesn\'t remember your previous call. This is annoying for humans but great for scalability.',
        tags: ['Architecture'],
      },
      {
        id: 'client-server',
        title: 'Client-Server Separation',
        teaser: 'UI and data storage are completely decoupled.',
        explanation:
          'The client and server are independent systems with a clean contract (the API) between them. The client only cares about displaying data. The server only cares about storing and processing data. Neither knows how the other is built.\n\nResult: You can rewrite your React frontend without touching the Node.js backend. You can swap your PostgreSQL database without changing the API. You can add a mobile app that uses the same API.',
        tags: ['Architecture'],
      },
      {
        id: 'uniform-interface',
        title: 'Uniform Interface',
        teaser: 'Consistent conventions across all resources.',
        explanation:
          '4 constraints under Uniform Interface:\n\n1. Resource identification in requests — resources are identified by URIs (/users/42). The URI is a pointer, not the resource itself.\n2. Resource manipulation through representations — client receives a representation (JSON) and uses it to modify the resource via PUT/PATCH/DELETE.\n3. Self-descriptive messages — each message includes enough information to describe how to process it (Content-Type header, status code).\n4. HATEOAS — responses include links to related actions (see Advanced tab).',
        tags: ['Architecture'],
      },
      {
        id: 'cacheable',
        title: 'Cacheability',
        teaser: 'Responses must declare whether they can be cached.',
        explanation:
          'Responses must explicitly mark themselves as cacheable or non-cacheable using HTTP headers. When responses are cached, clients can reuse them without hitting the server again.\n\nKey headers:\n• Cache-Control: max-age=3600 — cache for 1 hour\n• Cache-Control: no-store — never cache (sensitive data)\n• ETag: "abc123" — fingerprint, client sends back in If-None-Match\n• Last-Modified — server can return 304 Not Modified if unchanged\n\nGET requests should always be cacheable unless they return user-specific or real-time data.',
        code: `// Server response with caching headers
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=3600
ETag: "a3f8c2d1"

{ "currencies": ["USD", "EUR", "INR"] }

// Client's next request (conditional GET)
GET /api/currencies HTTP/1.1
If-None-Match: "a3f8c2d1"

// Server response if nothing changed — saves bandwidth
HTTP/1.1 304 Not Modified`,
        codeLang: 'http',
        tags: ['Performance'],
      },
      {
        id: 'layered-system',
        title: 'Layered System',
        teaser: 'Client doesn\'t know if it\'s talking to the real server.',
        explanation:
          'The client only knows about the immediate layer it\'s communicating with. Between the client and the origin server, there can be multiple layers: load balancers, CDN edge nodes, API gateways, caches, security proxies. Each layer only sees what it needs to. This enables:\n\n• CDN caching of API responses globally\n• API gateways for auth, rate limiting, routing\n• Load balancers for scaling\n\nThe client\'s code doesn\'t change whether it\'s hitting a CDN edge, a gateway, or the actual server.',
        tags: ['Architecture'],
      },
    ],
  },
  {
    id: 'designing',
    label: 'Designing APIs',
    icon: Zap,
    topics: [
      {
        id: 'resource-naming',
        title: 'Resource Naming Conventions',
        teaser: 'URLs are nouns. Methods are verbs.',
        explanation:
          'REST URLs represent resources (nouns), never actions (verbs). The HTTP method is the action.\n\nRules:\n• Use plural nouns: /users not /user, /orders not /getOrder\n• Use lowercase and hyphens: /user-profiles not /userProfiles\n• Nest related resources: /users/42/orders\n• IDs in the path: /users/:id not /users?id=42\n• Never use verbs in URLs: NOT /getUsers, NOT /createUser\n\nGood vs Bad:\n✅ GET /users — list users\n✅ POST /users — create user\n✅ GET /users/42 — get user 42\n✅ GET /users/42/orders — get orders for user 42\n❌ GET /getUsers\n❌ POST /createUser\n❌ GET /user/orders/42',
        code: `// Resource-oriented URL design
GET    /api/v1/products          // list all products
POST   /api/v1/products          // create product
GET    /api/v1/products/123      // get product 123
PUT    /api/v1/products/123      // replace product 123
PATCH  /api/v1/products/123      // partially update product 123
DELETE /api/v1/products/123      // delete product 123

// Nested resources
GET    /api/v1/users/42/orders   // orders belonging to user 42
POST   /api/v1/users/42/orders   // create order for user 42
GET    /api/v1/users/42/orders/7 // specific order for user 42`,
        codeLang: 'http',
        tags: ['Design'],
      },
      {
        id: 'versioning',
        title: 'API Versioning',
        teaser: 'Never break existing clients when you evolve your API.',
        explanation:
          'Once an API is live, clients depend on it. Breaking changes must be versioned so old clients keep working.\n\n3 common strategies:\n\n1. URL versioning (most common): /api/v1/users → /api/v2/users\n   Pros: Visible, easy to test in browser, easy to route\n   Cons: URL "purity" purists dislike it\n\n2. Header versioning: Accept: application/vnd.myapi.v2+json\n   Pros: Clean URLs\n   Cons: Can\'t test in browser directly\n\n3. Query param: /api/users?version=2\n   Pros: Simple\n   Cons: Can be accidentally cached with v1 params\n\nRecommendation: Use URL versioning (/v1, /v2). It\'s the most practical and visible.',
        code: `// URL versioning (recommended)
/api/v1/users
/api/v2/users  // v2 with breaking changes

// What counts as a breaking change?
// - Removing a field
// - Renaming a field
// - Changing a field's type
// - Changing URL structure
// - Changing error format

// What is NOT a breaking change?
// - Adding a new optional field
// - Adding a new endpoint
// - Adding a new optional query param`,
        codeLang: 'text',
        tags: ['Design'],
      },
      {
        id: 'pagination',
        title: 'Pagination, Filtering & Sorting',
        teaser: 'Never return 10,000 rows in one response.',
        explanation:
          'Large collections must be paginated. Two main strategies:\n\n1. Offset pagination: ?page=2&limit=20\n   Simple to implement. Breaks when items are added/removed mid-pagination.\n\n2. Cursor pagination: ?cursor=eyJpZCI6NX0&limit=20\n   Uses an opaque cursor pointing to the last seen item. Stable. Preferred for real-time data feeds.\n\nFiltering: Use query params — /products?category=electronics&inStock=true\nSorting: /products?sort=price&order=asc\n\nAlways include metadata: total count, next/prev cursors or page numbers.',
        code: `// Offset pagination response
{
  "data": [...],
  "pagination": {
    "total": 342,
    "page": 2,
    "limit": 20,
    "totalPages": 18
  }
}

// Cursor pagination response
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6NDB9",
    "hasMore": true,
    "limit": 20
  }
}

// Filtering + sorting example
GET /api/products?category=electronics&minPrice=100&sort=price&order=asc&page=1&limit=20`,
        codeLang: 'json',
        tags: ['Design'],
      },
      {
        id: 'error-format',
        title: 'Consistent Error Format',
        teaser: 'Errors should be as informative as success responses.',
        explanation:
          'Return consistent, structured error responses — not just a status code. Clients need to know what went wrong and ideally how to fix it.\n\nBest practice error body:\n• error.code — machine-readable string (VALIDATION_FAILED)\n• error.message — human-readable description\n• error.details — field-level errors for validation\n• requestId — correlation ID for debugging\n\nNever expose stack traces, internal paths, or database error messages in production.',
        code: `// Validation error (422)
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request body contains invalid fields.",
    "details": [
      { "field": "email", "message": "Must be a valid email address." },
      { "field": "age",   "message": "Must be a positive integer." }
    ]
  },
  "requestId": "req_7f3a92bc"
}

// Not found (404)
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with id 42 does not exist."
  },
  "requestId": "req_7f3a92bc"
}`,
        codeLang: 'json',
        tags: ['Design'],
      },
    ],
  },
  {
    id: 'auth',
    label: 'Auth & Security',
    icon: Shield,
    topics: [
      {
        id: 'api-keys',
        title: 'API Keys',
        teaser: 'Simplest form of API authentication.',
        explanation:
          'An API key is a secret string issued to a client that identifies who is making the request. Simple to implement but coarse-grained — the key either has access or it doesn\'t.\n\nCommon patterns:\n• Header: Authorization: ApiKey sk_live_abc123\n• Header: X-API-Key: sk_live_abc123\n• Query param: ?api_key=... (avoid — leaks in logs and browser history)\n\nBest for: server-to-server communication, internal tooling, simple public APIs.\n\nLimitations: No user identity, no expiry by default, must be rotated manually if leaked.',
        code: `// Sending an API key
curl -H "X-API-Key: sk_live_abc123" https://api.example.com/data

// Node.js fetch
fetch('https://api.example.com/data', {
  headers: {
    'X-API-Key': process.env.API_KEY
  }
})`,
        codeLang: 'bash',
        tags: ['Auth'],
      },
      {
        id: 'jwt',
        title: 'JWT — JSON Web Tokens',
        teaser: 'Stateless auth tokens that carry claims.',
        explanation:
          'A JWT is a Base64-encoded, cryptographically signed token with three parts: Header.Payload.Signature\n\n• Header: algorithm (HS256, RS256)\n• Payload: claims — userId, role, exp (expiry), iat (issued at)\n• Signature: HMAC or RSA signature to prevent tampering\n\nFlow:\n1. User logs in → server verifies credentials → server issues a JWT signed with a secret\n2. Client stores JWT (localStorage or httpOnly cookie)\n3. Client sends JWT in every request: Authorization: Bearer <token>\n4. Server verifies signature — if valid, trusts the payload. No DB lookup needed.\n\nExpiry: Always set exp. Short-lived access tokens (15m–1h) + long-lived refresh tokens (7–30d).\n\nImportant: The payload is base64-encoded, NOT encrypted. Anyone can decode it. Never put sensitive data (passwords, PII) in a JWT payload.',
        code: `// JWT structure (decoded)
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload (claims)
{
  "sub": "usr_42",
  "name": "Rithvik",
  "role": "admin",
  "iat": 1715000000,
  "exp": 1715003600   // 1 hour from now
}

// Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET)

// Final token looks like:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfNDIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36P

// Using the token
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

// Verifying in Node.js (jsonwebtoken package)
import jwt from 'jsonwebtoken'
const payload = jwt.verify(token, process.env.JWT_SECRET)
// throws if expired or tampered`,
        codeLang: 'javascript',
        tags: ['Auth'],
      },
      {
        id: 'oauth',
        title: 'OAuth 2.0 Basics',
        teaser: '"Sign in with Google" under the hood.',
        explanation:
          'OAuth 2.0 is an authorization framework that lets users grant third-party apps access to their data without sharing passwords.\n\nKey roles:\n• Resource Owner — the user\n• Client — your app wanting access\n• Authorization Server — issues tokens (Google, GitHub, Auth0)\n• Resource Server — the API holding the user\'s data\n\nMost common flow (Authorization Code + PKCE):\n1. Your app redirects user to Google\'s auth page\n2. User logs in to Google and approves access\n3. Google redirects back to your app with an authorization code\n4. Your app exchanges the code for an access token (server-side)\n5. Your app uses the access token to call Google APIs\n\nFor most apps, use a library (NextAuth, Auth0, Supabase Auth) — don\'t implement OAuth from scratch.',
        tags: ['Auth'],
      },
      {
        id: 'rate-limiting',
        title: 'Rate Limiting',
        teaser: 'Protect your API from abuse and overload.',
        explanation:
          'Rate limiting restricts how many requests a client can make in a time window.\n\nCommon strategies:\n• Fixed window: 100 requests per minute. Simple but allows bursts at window boundaries.\n• Sliding window: Smoothed rate over a rolling window. More accurate.\n• Token bucket: Client has a bucket of tokens, each request consumes one. Tokens refill at a fixed rate. Allows controlled bursts.\n\nHTTP headers to communicate limits:\n• X-RateLimit-Limit: 100\n• X-RateLimit-Remaining: 47\n• X-RateLimit-Reset: 1715003600 (Unix timestamp)\n• Retry-After: 30 (seconds, when 429 is returned)\n\nReturn 429 Too Many Requests when the limit is exceeded.',
        code: `// Rate limit response headers
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1715003600
Retry-After: 47
Content-Type: application/json

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 47 seconds."
  }
}`,
        codeLang: 'http',
        tags: ['Security'],
      },
      {
        id: 'cors',
        title: 'CORS',
        teaser: 'Why your fetch call fails in the browser but works in curl.',
        explanation:
          'CORS (Cross-Origin Resource Sharing) is a browser security mechanism. Browsers block JavaScript from making requests to a different origin (domain/port/protocol) than the page was loaded from — this is the Same-Origin Policy.\n\nCORS allows servers to explicitly whitelist origins that are allowed to make cross-origin requests.\n\nHow it works:\n1. Browser sends a preflight OPTIONS request to the server\n2. Server responds with Access-Control-Allow-Origin header\n3. If the origin is allowed, browser proceeds with the actual request\n\nKey headers:\n• Access-Control-Allow-Origin: https://myapp.com (or * for public APIs)\n• Access-Control-Allow-Methods: GET, POST, PUT, DELETE\n• Access-Control-Allow-Headers: Authorization, Content-Type\n• Access-Control-Allow-Credentials: true (for cookies/auth headers)\n\ncurl ignores CORS — it\'s a browser-only mechanism.',
        code: `// Express.js CORS setup
import cors from 'cors'

app.use(cors({
  origin: ['https://myapp.com', 'https://www.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true  // allow cookies & auth headers
}))

// Next.js API route (app/api/route.ts)
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://myapp.com',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  })
}`,
        codeLang: 'javascript',
        tags: ['Security'],
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: Layers,
    topics: [
      {
        id: 'rest-vs-graphql-grpc',
        title: 'REST vs GraphQL vs gRPC',
        teaser: 'When to use which API style.',
        explanation:
          'REST: The default. Use for public APIs, CRUD apps, simple client-server. Great tooling, widely understood.\n\nGraphQL: Use when clients have very different data needs (mobile vs web), you want to avoid over-fetching/under-fetching, or you have a complex graph of related data. Client asks for exactly what it needs. One endpoint (/graphql). Learning curve is higher. Not ideal for file uploads or simple CRUD.\n\ngRPC: Use for internal service-to-service communication where performance is critical. Uses Protocol Buffers (binary, ~7x smaller than JSON). Supports streaming. Requires HTTP/2. Not usable from browsers natively without a proxy. Not human-readable.\n\nDecision guide:\n• Public API for web/mobile apps → REST\n• Complex product with many client types → GraphQL\n• Internal microservices, high-throughput → gRPC',
        tags: ['Architecture'],
      },
      {
        id: 'idempotency',
        title: 'Idempotency',
        teaser: 'Calling the same operation twice = same result as calling it once.',
        explanation:
          'An operation is idempotent if repeating it produces the same result.\n\nGET — always idempotent (read-only)\nDELETE — idempotent (deleting a deleted resource = still deleted, return 404 or 204)\nPUT — idempotent (replacing a resource twice leaves it in the same state)\nPOST — NOT idempotent by default (creates a new resource each time)\nPATCH — depends on the operation\n\nFor POST operations that must be idempotent (e.g., payment processing), use an Idempotency-Key header. The client generates a unique key per operation. If the server sees the same key again, it returns the cached result instead of creating a duplicate.',
        code: `// Idempotency key for payment (prevents double-charge)
POST /api/payments HTTP/1.1
Idempotency-Key: uuid-4f8a-92bc-...
Content-Type: application/json

{
  "amount": 999,
  "currency": "INR",
  "userId": "usr_42"
}

// Server: if it sees this key again, return the original response
// without processing the payment a second time`,
        codeLang: 'http',
        tags: ['Design'],
      },
      {
        id: 'hateoas',
        title: 'HATEOAS',
        teaser: 'API responses that tell clients what they can do next.',
        explanation:
          'HATEOAS (Hypermedia as the Engine of Application State) means API responses include links to related actions. Clients don\'t need to hard-code URLs — they discover them from responses.\n\nIn practice: Very few production APIs implement HATEOAS strictly. It adds complexity with modest real-world benefit. You\'ll see it mentioned in interviews and architecture discussions. Knowing what it is matters more than implementing it.',
        code: `// HATEOAS response example
{
  "id": 42,
  "name": "Rithvik",
  "status": "active",
  "_links": {
    "self":    { "href": "/users/42" },
    "orders":  { "href": "/users/42/orders" },
    "suspend": { "href": "/users/42/suspend", "method": "POST" },
    "delete":  { "href": "/users/42", "method": "DELETE" }
  }
}`,
        codeLang: 'json',
        tags: ['Architecture'],
      },
      {
        id: 'webhooks-vs-polling',
        title: 'Webhooks vs Polling',
        teaser: 'Push vs pull — when to use each.',
        explanation:
          'Polling: Client repeatedly asks "has anything changed?" on an interval.\n• Simple to implement\n• Wastes resources if nothing changes\n• Introduces latency (up to the polling interval)\n• Use when: simplicity matters, low-frequency updates, webhook setup is hard\n\nWebhooks: Server calls YOUR endpoint when something happens.\n• Efficient — no wasted requests\n• Real-time\n• Harder to set up (your server must be publicly reachable, handle retries, verify signatures)\n• Use when: real-time events, payment providers (Stripe, Razorpay), CI/CD triggers, n8n/Zapier integrations\n\nLong Polling: Client makes a request, server holds it open until there\'s data or timeout. Middle ground. Mostly replaced by WebSockets for true real-time.',
        code: `// Webhook handler in Next.js
// POST /api/webhooks/stripe
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  // Always verify the signature to prevent spoofing
  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    await db.orders.update({ paymentId: paymentIntent.id, status: 'paid' })
  }

  return Response.json({ received: true })
}`,
        codeLang: 'typescript',
        tags: ['Architecture'],
      },
      {
        id: 'openapi',
        title: 'API Documentation (OpenAPI/Swagger)',
        teaser: 'The standard for machine-readable API specs.',
        explanation:
          'OpenAPI (formerly Swagger) is a YAML/JSON specification format for describing REST APIs. From one spec file you get:\n• Auto-generated interactive documentation (Swagger UI)\n• Client SDK generation in any language\n• Server stub generation\n• Automated contract testing\n\nTools:\n• Swagger UI / Redoc — renders the spec as interactive docs\n• Postman — can import OpenAPI specs\n• zod-to-openapi, tsoa — generate specs from TypeScript code\n\nWhere to put docs: /api/docs (Swagger UI), /api/openapi.json (raw spec)',
        code: `# openapi.yaml (example)
openapi: 3.0.0
info:
  title: InterviewDump API
  version: 1.0.0

paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found

components:
  schemas:
    User:
      type: object
      properties:
        id:   { type: string }
        name: { type: string }`,
        codeLang: 'yaml',
        tags: ['Tooling'],
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Wrench,
    topics: [
      {
        id: 'curl',
        title: 'curl — Command Line Testing',
        teaser: 'Test any API endpoint from your terminal.',
        explanation:
          'curl is the universal tool for making HTTP requests from the command line. Available on every OS. No install needed on Linux/Mac. Comes bundled with Git Bash on Windows.\n\nEssential flags:\n• -X — HTTP method\n• -H — add a header\n• -d — request body\n• -i — show response headers\n• -v — verbose (show full request + response)\n• --json — shorthand for -H "Content-Type: application/json" -d (curl 7.82+)',
        code: `# GET request
curl https://api.example.com/users/42

# GET with auth header and show headers
curl -i -H "Authorization: Bearer eyJ..." https://api.example.com/me

# POST JSON body
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{"name": "Rithvik", "role": "developer"}'

# PATCH
curl -X PATCH https://api.example.com/users/42 \
  -H "Content-Type: application/json" \
  -d '{"role": "senior developer"}'

# DELETE
curl -X DELETE https://api.example.com/users/42 \
  -H "Authorization: Bearer eyJ..."

# Verbose mode (see exactly what's sent and received)
curl -v https://api.example.com/users`,
        codeLang: 'bash',
        tags: ['Tooling'],
      },
      {
        id: 'postman',
        title: 'Postman & Insomnia',
        teaser: 'GUI tools for building, testing, and documenting APIs.',
        explanation:
          'Postman and Insomnia are desktop/web apps for interacting with APIs without writing code.\n\nPostman features:\n• Collections — group related requests\n• Environments — switch between dev/staging/prod base URLs and tokens\n• Tests — write JavaScript assertions on responses\n• Mock servers — fake an API that doesn\'t exist yet\n• Team workspaces — share collections with colleagues\n• Auto-generate code snippets (curl, fetch, axios, etc.)\n\nInsomnia is lighter and more developer-focused. It also supports GraphQL and gRPC natively.\n\nFor VS Code users: Thunder Client extension gives you a Postman-like UI inside the editor.',
        tags: ['Tooling'],
      },
      {
        id: 'fetch-axios',
        title: 'fetch vs axios',
        teaser: 'The two main ways to call APIs from JavaScript.',
        explanation:
          'fetch: Built into all modern browsers and Node.js 18+. No install. Verbose for error handling (fetch doesn\'t throw on 4xx/5xx — you must check response.ok).\n\naxios: Third-party library (npm install axios). Auto-parses JSON, throws on 4xx/5xx by default, supports request/response interceptors, timeout config, upload progress. Better DX but adds ~14KB to bundle.\n\nUse fetch when: you want zero deps, simple GET requests, Next.js server components (has caching support built-in).\nUse axios when: you need interceptors, consistent error handling across a large codebase, upload progress events.',
        code: `// fetch — manual error handling needed
const res = await fetch('/api/users/42', {
  headers: { Authorization: \`Bearer \${token}\` }
})
if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
const user = await res.json()

// axios — throws automatically on 4xx/5xx
import axios from 'axios'
const { data: user } = await axios.get('/api/users/42', {
  headers: { Authorization: \`Bearer \${token}\` }
})

// axios with interceptors (add auth header to all requests)
axios.interceptors.request.use(config => {
  config.headers.Authorization = \`Bearer \${getToken()}\`
  return config
})`,
        codeLang: 'javascript',
        tags: ['Tooling'],
      },
    ],
  },
]

// ── Expandable Card ───────────────────────────────────────────────────────────

function TopicCard({ topic }: { topic: TopicCard }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-2xl bg-surface overflow-hidden transition-all duration-200 hover:border-indigo/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-text">{topic.title}</span>
            {topic.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-dim text-indigo-light border border-indigo/20"
              >
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
            <div className="flex justify-end">
              <ReadAloudButton text={[topic.title, topic.explanation, topic.analogy].filter(Boolean).join('. ')} />
            </div>
            {/* Explanation */}
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
              {topic.explanation}
            </p>

            {/* Analogy */}
            {topic.analogy && (
              <div className="border border-indigo/30 bg-indigo-dim rounded-xl px-4 py-3">
                <p className="text-[11px] font-mono text-indigo-light uppercase tracking-widest mb-1">
                  Real-world analogy
                </p>
                <p className="text-sm text-text-muted leading-relaxed">{topic.analogy}</p>
              </div>
            )}

            {/* Code */}
            {topic.code && (
              <div>
                <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  {topic.codeLang ?? 'Code'}
                </p>
                <pre className="bg-surface border border-border rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-text-muted">
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RestApisPage() {
  const [activeCategory, setActiveCategory] = useState<string>('basics')

  const current = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="REST APIs"
        subtitle="Everything you need to know about building and consuming REST APIs — from HTTP basics to auth, design patterns, and tooling."
      />

      {/* Category Tabs */}
      <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap gap-2 bg-bg">
        {CATEGORIES.map((cat) => {
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
              <span
                className={`text-[10px] font-mono ml-0.5 ${
                  isActive ? 'text-white/70' : 'text-text-dim'
                }`}
              >
                {cat.topics.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Topics */}
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl w-full">
        <div className="space-y-3">
          {current.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  )
}
