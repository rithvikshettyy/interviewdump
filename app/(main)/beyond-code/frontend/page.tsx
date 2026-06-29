'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import { ChevronDown, ChevronUp, Shield, Globe, Layout, Layers, Zap, Database, Activity, Wifi } from 'lucide-react'

interface TopicCard {
  id: string
  title: string
  teaser: string
  explanation: string
  analogy?: string
  code?: string
  codeLang?: string
  tags?: string[]
  youtubeQueries?: string[]
}

interface Category {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  topics: TopicCard[]
}

const CATEGORIES: Category[] = [
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: Shield,
    topics: [
      {
        id: 'ts-why',
        title: 'Why TypeScript?',
        teaser: 'Static types catch bugs at compile time that JavaScript only catches at runtime — or never.',
        explanation: `TypeScript is a typed superset of JavaScript that compiles to plain JS. You write .ts/.tsx files; the TypeScript compiler checks your types and outputs valid JS that runs anywhere.

Why it matters: In JavaScript, typos in property names, wrong argument types, and null/undefined access are invisible at write time and explode at runtime. TypeScript catches these before you run a single line.

Core features include type annotations, interfaces and types for object shapes, union types (string | number | null), strict null checks, and type inference — TS often knows the type without you writing it.

Every serious frontend job posting now lists TypeScript. It is no longer optional for production codebases.`,
        code: `// JavaScript — bug invisible until runtime
function greet(user) {
  return 'Hello, ' + user.nme  // typo: "nme" not "name"
}

// TypeScript — caught instantly at compile time
interface User {
  name: string
  email: string
  age?: number  // optional field
}

function greet(user: User): string {
  return 'Hello, ' + user.nme  // ❌ Error: Property 'nme' does not exist on type 'User'
}

// Union types — restrict to known values
type Status = 'active' | 'inactive' | 'pending'
let userStatus: Status = 'active'
// userStatus = 'deleted'  ❌ Type '"deleted"' not assignable to type 'Status'

// Type inference — no annotation needed
const count = 0         // TS infers: number
const name = 'Rithvik'  // TS infers: string`,
        codeLang: 'typescript',
        tags: ['TypeScript'],
        youtubeQueries: ['TypeScript full course', 'TypeScript tutorial for beginners 2026'],
      },
      {
        id: 'ts-generics',
        title: 'TypeScript Generics',
        teaser: 'Write reusable code that works with any type while keeping full type safety.',
        explanation: `Generics are type-level variables. Instead of writing the same function 10 times for 10 different types, write it once with a generic type parameter <T>. The actual type is determined at the call site.

The constraint syntax (T extends SomeType) lets you restrict what types can be passed in, giving you access to properties of that type within the generic function.

Built-in utility types are the most practical day-to-day generics use: Partial<T> makes all properties optional, Required<T> makes all required, Pick<T, K> picks a subset, Omit<T, K> removes properties, ReturnType<F> extracts a function's return type, and Record<K, V> creates an object type.`,
        code: `// Generic function — type is inferred at call site
function identity<T>(value: T): T { return value }

const num = identity<number>(42)
const str = identity('hello')  // T inferred as string

// Generic with keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Generic API response wrapper — used constantly in real apps
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type UserResponse = ApiResponse<{ id: string; name: string }>
type ListResponse  = ApiResponse<string[]>

// Utility types
interface User {
  id: string
  name: string
  email: string
  password: string
}

type PublicUser  = Omit<User, 'password'>                   // { id, name, email }
type UpdateUser  = Partial<Pick<User, 'name' | 'email'>>    // all optional
type UserRecord  = Record<string, User>                     // { [key: string]: User }`,
        codeLang: 'typescript',
        tags: ['TypeScript'],
        youtubeQueries: ['TypeScript generics explained'],
      },
      {
        id: 'ts-react',
        title: 'TypeScript with React',
        teaser: 'How to type props, hooks, events, and refs in React components.',
        explanation: `Props: Define an interface for your component's props and pass it as the generic to the function parameter. Prefer typing the function directly over using React.FC — it's more explicit and avoids some quirks.

Hooks: useState infers the type from the initial value. When the initial value is null or an empty array, provide the type explicitly: useState<User | null>(null).

Events: React wraps native DOM events with its own types. Common ones: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>, React.FormEvent<HTMLFormElement>.

Refs: useRef<HTMLInputElement>(null) gives you a typed ref. Access via inputRef.current?.focus() — the optional chain handles the null initial value.`,
        code: `// Typing component props
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  children?: React.ReactNode
}

function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}

// useState with explicit type (initial value is null)
const [user, setUser]   = useState<User | null>(null)
const [items, setItems] = useState<string[]>([])

// Event typing
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value)
}
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
}

// useRef
const inputRef = useRef<HTMLInputElement>(null)
inputRef.current?.focus()

// Generic data-fetching hook
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url).then(r => r.json() as Promise<T>).then(setData).finally(() => setLoading(false))
  }, [url])
  return { data, loading }
}`,
        codeLang: 'typescript',
        tags: ['TypeScript', 'React'],
        youtubeQueries: ['TypeScript with React tutorial'],
      },
    ],
  },
  {
    id: 'browser',
    label: 'Browser & DOM',
    icon: Globe,
    topics: [
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        teaser: "The browser's JavaScript API for reading and modifying the HTML document at runtime.",
        explanation: `The DOM (Document Object Model) is the browser's in-memory tree representation of your HTML. JavaScript can read and modify this tree, and the browser re-renders affected parts.

Key APIs: querySelector/querySelectorAll find elements by CSS selector. createElement creates new nodes. appendChild/prepend/insertBefore insert them. element.remove() deletes them. classList.add/remove/toggle manages CSS classes. dataset reads and writes data-* attributes.

Content safety: textContent sets plain text safely. innerHTML renders an HTML string — useful but dangerous with user input (XSS vector). Always sanitize before using innerHTML with user-supplied data.

Performance: Minimize DOM reads inside loops. Batch DOM writes. For inserting many elements, use DocumentFragment — it accumulates changes and causes only one reflow when appended.`,
        code: `// Finding elements
const heading  = document.querySelector('h1')
const buttons  = document.querySelectorAll<HTMLButtonElement>('.btn')

// Creating and inserting
const li = document.createElement('li')
li.textContent = 'New item'
li.classList.add('list-item', 'highlighted')
li.dataset.id = '42'  // sets data-id="42"
document.getElementById('myList')?.appendChild(li)

// Batch insert with DocumentFragment — ONE reflow instead of N
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const el = document.createElement('div')
  el.textContent = \`Item \${i}\`
  fragment.appendChild(el)
}
document.getElementById('container')?.appendChild(fragment)

// Toggle CSS class
const btn = document.querySelector<HTMLElement>('.toggle-btn')
btn?.classList.toggle('active')

// Removing elements
document.querySelector('.old-banner')?.remove()`,
        codeLang: 'javascript',
        tags: ['Browser', 'DOM'],
        youtubeQueries: ['DOM manipulation JavaScript'],
      },
      {
        id: 'event-delegation',
        title: 'Event Delegation',
        teaser: 'Attach one listener to a parent to handle events from all its children — including dynamic ones.',
        explanation: `Event bubbling: when an event fires on an element, it propagates up through all ancestors to the document root. Event delegation exploits this — one listener on the parent catches events from all its children.

Why use it: performance (one listener vs. N), and it works for dynamically added elements since the parent listener was already there.

The key property is event.target — it identifies the exact element that was interacted with. Use event.target.closest('.selector') to find the nearest matching ancestor regardless of which child within it was clicked.`,
        analogy: "Instead of a security guard at every apartment door, one guard at the building entrance checks everyone's visitor badges and routes them to the right floor.",
        code: `// ❌ N listeners — also breaks for dynamically added items
document.querySelectorAll('.todo-item').forEach(item => {
  item.addEventListener('click', handleClick)
})

// ✅ One listener on the parent
const list = document.querySelector('#todo-list')
list?.addEventListener('click', (event) => {
  const item = (event.target as HTMLElement).closest('.todo-item')
  if (!item) return  // click was on the list background

  const id = (item as HTMLElement).dataset.id

  // Handle different buttons within each item
  const target = event.target as HTMLElement
  if (target.matches('.delete-btn')) {
    item.remove()
  } else if (target.matches('.complete-btn')) {
    item.classList.toggle('completed')
  }
})

// Items added later are automatically covered
const newItem = document.createElement('li')
newItem.className = 'todo-item'
newItem.dataset.id = '99'
newItem.innerHTML = '<span>New task</span><button class="delete-btn">×</button>'
list?.appendChild(newItem)`,
        codeLang: 'javascript',
        tags: ['Browser', 'Events'],
        youtubeQueries: ['event delegation JavaScript'],
      },
      {
        id: 'browser-rendering',
        title: 'Browser Rendering Pipeline',
        teaser: 'How HTML + CSS + JS becomes pixels — and what makes it expensive.',
        explanation: `Every frame the browser renders goes through this pipeline:

Parse HTML → DOM tree. Parse CSS → CSSOM. Combine both → Render Tree (only visible elements). Layout (Reflow): calculate exact position and size of every element. Paint: fill pixels — colors, text, borders, shadows. Composite: layer painted outputs together (GPU-accelerated).

Reflow is the most expensive step. It's triggered by changing width, height, position, adding/removing DOM elements, or reading layout properties (offsetHeight, getBoundingClientRect) after a write. One reflow can cascade through the entire document.

Repaint is cheaper — triggered by color, opacity, or visibility changes that don't affect layout.

Optimization rule: batch all DOM reads first, then all writes. Never interleave them in a loop. Use CSS transforms and opacity for animations — they only trigger compositing, not layout or paint.`,
        analogy: 'Building a stage set: read the script (HTML), plan the lighting (CSS), build and position every prop (layout), paint it all (paint), photograph for the audience (composite).',
        code: `// ❌ Layout thrashing: read/write interleaved forces reflow each iteration
for (const el of elements) {
  const height = el.offsetHeight          // READ — forces layout
  el.style.height = height + 10 + 'px'   // WRITE — invalidates layout
}

// ✅ Batch reads first, then writes
const heights = elements.map(el => el.offsetHeight)  // all READs
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'           // all WRITEs
})

/* ❌ Causes reflow on every frame */
el.style.left = x + 'px'

/* ✅ Only triggers compositing (GPU layer) — buttery smooth */
el.style.transform = \`translateX(\${x}px)\`

/* Promote heavy animations to their own GPU layer */
.animated-element {
  will-change: transform;
}`,
        codeLang: 'javascript',
        tags: ['Browser', 'Performance'],
        youtubeQueries: ['browser rendering pipeline explained'],
      },
      {
        id: 'how-browser-works',
        title: 'How a Browser Works',
        teaser: 'From typing a URL to a fully rendered page — every step explained.',
        explanation: `1. DNS Resolution: browser checks memory cache, then OS, then router, then ISP DNS server to convert example.com to an IP address like 93.184.216.34.

2. TCP Connection: three-way handshake (SYN → SYN-ACK → ACK) to port 443 for HTTPS.

3. TLS Handshake: negotiate encryption, verify the server's SSL certificate, exchange session keys. ~1-2 round trips with TLS 1.3.

4. HTTP Request: GET / HTTP/1.1 with Host, Accept, Cookie headers sent to server.

5. Server Response: server processes and returns HTML with status 200 OK.

6. HTML Parsing: browser parses HTML top-to-bottom building the DOM. A synchronous script tag stops parsing until the JS downloads and executes. CSS in the head blocks rendering (not parsing).

7. Resource Loading: browser discovers linked CSS, JS, images, fonts and fetches them in parallel (limited by connection pool per origin).

8. Render: DOM + CSSOM → Render Tree → Layout → Paint → Composite.`,
        analogy: "Typing a URL is like ordering food by phone. DNS = finding the restaurant's number. TCP = the call connecting. TLS = confirming it's really the restaurant. HTTP request = placing your order. HTML response = receiving the recipe. Rendering = cooking the meal.",
        code: `<!-- Speed up the critical path with resource hints -->

<!-- DNS lookup starts early (no TCP yet) -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- Full pre-connect: DNS + TCP + TLS -->
<link rel="preconnect" href="https://api.example.com">

<!-- Preload the LCP image — loads in parallel with HTML parsing -->
<link rel="preload" href="/hero.webp" as="image" type="image/webp">

<!-- Non-critical JS: defer runs after HTML parsed, before DOMContentLoaded -->
<script defer src="/analytics.js"></script>

<!-- async: downloads in parallel, runs immediately when ready (order not guaranteed) -->
<script async src="/ads.js"></script>

<!-- ES module scripts are deferred by default -->
<script type="module" src="/app.js"></script>`,
        codeLang: 'html',
        tags: ['Browser'],
        youtubeQueries: ['how browser works step by step'],
      },
    ],
  },
  {
    id: 'css',
    label: 'HTML & CSS',
    icon: Layout,
    topics: [
      {
        id: 'flexbox',
        title: 'CSS Flexbox',
        teaser: 'One-dimensional layout — align items along a row or column with minimal code.',
        explanation: `Flexbox operates on one axis at a time (row or column). The container controls alignment; items control how much space they take.

Container properties: display:flex activates it. flex-direction sets the main axis (row default, column). justify-content aligns along the main axis (flex-start, center, flex-end, space-between, space-around, space-evenly). align-items aligns along the cross axis (stretch default, center, flex-start, flex-end). flex-wrap allows items to wrap. gap sets spacing between items.

Item properties: flex-grow controls how much extra space an item claims. flex-shrink controls how much it shrinks when space is tight. flex-basis is the initial size before growing or shrinking. The shorthand flex: 1 means grow:1, shrink:1, basis:0 — take equal share of available space. order changes visual order without touching the DOM.`,
        code: `/* Center anything — the most common use case */
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;
}

/* Navigation bar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
}

/* Responsive card row that wraps */
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 280px;  /* grow, shrink, min-width 280px */
  max-width: 400px;
}

/* Sidebar + main — sidebar fixed width, main takes rest */
.layout {
  display: flex;
  gap: 24px;
}
.sidebar { flex: 0 0 240px; }  /* never grow or shrink */
.main    { flex: 1; min-width: 0; }  /* min-width: 0 prevents overflow */`,
        codeLang: 'css',
        tags: ['CSS', 'Layout'],
        youtubeQueries: ['CSS flexbox crash course'],
      },
      {
        id: 'grid',
        title: 'CSS Grid',
        teaser: 'Two-dimensional layout — control rows AND columns simultaneously.',
        explanation: `CSS Grid is ideal when you need control over both axes at once: dashboards, image galleries, complex page structures. Flexbox is better for linear arrangements; Grid is better for placing things on a 2D canvas.

grid-template-columns defines column widths. The fr unit (fractional) divides remaining space — 1fr 2fr means the second column is twice the first. repeat(3, 1fr) creates three equal columns. minmax(min, max) constrains column size between a minimum and maximum.

auto-fill vs auto-fit with minmax creates responsive grids without media queries. auto-fill creates as many columns as fit; auto-fit collapses empty columns so items stretch.

grid-template-areas gives regions semantic names and lets you place items by name instead of line numbers.`,
        code: `/* Responsive gallery — no media queries needed */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

/* Named areas — semantic page layout */
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header  header"
    "sidebar main  "
    "footer  footer";
  min-height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* Spanning — featured card takes two columns */
.featured {
  grid-column: 1 / 3;  /* from line 1 to line 3 */
  grid-row: span 2;    /* spans 2 rows */
}

/* 12-column system */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
.col-6 { grid-column: span 6; }`,
        codeLang: 'css',
        tags: ['CSS', 'Layout'],
        youtubeQueries: ['CSS grid crash course'],
      },
      {
        id: 'responsive',
        title: 'Responsive Web Design',
        teaser: 'Layouts that adapt to any screen using fluid units and media queries.',
        explanation: `Three pillars: viewport meta tag, fluid units, and media queries.

Viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1"> is mandatory. Without it, mobile browsers render at desktop width and scale down, ignoring your CSS.

Mobile-first approach: write base styles for mobile, then add min-width media queries for larger screens. This produces cleaner, less-overriding CSS than the reverse.

Fluid units: % is relative to the parent. rem is relative to the root font size (16px default). vh/vw are relative to the viewport. em is relative to the current element's font size. Use rem for font sizes (respects user preferences), px for borders, % or fr for layout widths.

clamp(min, preferred, max) creates fluid values that respond to viewport width without a media query. clamp(1.5rem, 4vw, 3rem) scales the font size between 1.5rem and 3rem based on viewport width.`,
        code: `/* Always include this in <head> */
/* <meta name="viewport" content="width=device-width, initial-scale=1"> */

/* Mobile-first base (applies to all screen sizes) */
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.container { padding: 0 16px; }

/* Tablet and up */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .container { padding: 0 32px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Fluid typography — no media queries */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
.section { padding: clamp(32px, 8vw, 96px) 0; }

/* Fluid images */
img { max-width: 100%; height: auto; }`,
        codeLang: 'css',
        tags: ['CSS', 'Responsive'],
        youtubeQueries: ['responsive web design tutorial'],
      },
      {
        id: 'specificity',
        title: 'CSS Specificity',
        teaser: 'How the browser decides which CSS rule wins when multiple rules apply to the same element.',
        explanation: `Specificity is calculated as a 4-part score: (inline, IDs, classes/pseudo-classes/attributes, elements/pseudo-elements). Higher score wins. Equal score: last declared wins.

The hierarchy from highest to lowest: !important overrides everything (use as last resort). Inline styles (style="") beat all stylesheet rules. ID selectors (#header) beat class selectors. Class, pseudo-class (:hover), and attribute selectors ([type="text"]) beat element selectors. Element selectors (div, p) have the lowest specificity. The universal selector * has zero specificity.

A single ID selector (score: 0,1,0,0) beats any number of class selectors (0,0,N,0). This surprises people — adding more classes cannot beat a single ID.

Practical advice: avoid IDs in CSS; they create specificity debt. Prefer BEM or utility classes for predictable cascades. Avoid !important except in utility overrides.`,
        code: `/* Specificity scores shown as (inline, id, class, element) */

p          { color: black; }  /* (0,0,0,1) = 1 */
.text      { color: blue;  }  /* (0,0,1,0) = 10 — wins over p */
#intro     { color: red;   }  /* (0,1,0,0) = 100 — wins over .text */
#intro.text{ color: green; }  /* (0,1,1,0) = 110 */

/* Gotcha: many classes still lose to ONE id */
.a.b.c.d.e { color: orange; }  /* (0,0,5,0) = 50 */
#single     { color: purple; }  /* (0,1,0,0) = 100 — wins! */

/* :not() itself is zero specificity but its argument counts */
:not(.active) { color: gray; }  /* (0,0,1,0) — the .active counts */

/* !important overrides everything — even inline styles */
.forced { color: pink !important; }

/* Tailwind avoids this by giving every utility the same specificity */
/* source order in the generated stylesheet controls which wins */`,
        codeLang: 'css',
        tags: ['CSS'],
        youtubeQueries: ['CSS specificity explained'],
      },
      {
        id: 'modern-css',
        title: 'Modern CSS',
        teaser: 'CSS custom properties, container queries, :has(), and native nesting.',
        explanation: `CSS custom properties (variables): define once at :root, use anywhere with var(--name). Unlike Sass variables, they are runtime dynamic — JS can change them, media queries can override them, and child elements can locally override them.

Container queries: apply styles based on the parent container's size, not the viewport. This enables truly reusable components — a card can be compact in a sidebar and expanded in a wide layout without JavaScript.

:has() selector (the "parent selector"): select an element based on what it contains. li:has(img) targets list items that contain images. form:has(input:invalid) styles the form when any input is invalid.

Native CSS nesting (Chrome 112+, all modern browsers): nest selectors directly without Sass or PostCSS. The ampersand (&) refers to the parent selector.`,
        code: `/* CSS Custom Properties */
:root {
  --color-primary: #6366f1;
  --radius-md: 8px;
  --spacing-4: 16px;
}
.button {
  background: var(--color-primary);
  border-radius: var(--radius-md);
}

/* Dark mode via property overrides */
@media (prefers-color-scheme: dark) {
  :root { --color-primary: #818cf8; }
}

/* Container Queries — component-level responsiveness */
.card-wrapper { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }
}

/* :has() — style parent based on child state */
li:has(input:checked) { text-decoration: line-through; }
form:has(input:invalid) .submit-btn { opacity: 0.5; }

/* Native CSS Nesting */
.nav {
  display: flex;

  & a {
    color: inherit;
    &:hover { color: var(--color-primary); }
  }

  &.sticky { position: fixed; top: 0; }
}`,
        codeLang: 'css',
        tags: ['CSS'],
        youtubeQueries: ['modern CSS 2026'],
      },
    ],
  },
  {
    id: 'react',
    label: 'React',
    icon: Layers,
    topics: [
      {
        id: 'react-hooks',
        title: 'Core React Hooks',
        teaser: 'useState, useEffect, useRef, useMemo, useCallback — when and how to use each.',
        explanation: `useState stores local component state and triggers a re-render when updated. Use functional updates (setCount(prev => prev + 1)) when the next state depends on the previous to avoid stale closure bugs.

useEffect handles side effects: data fetching, subscriptions, DOM manipulation. The dependency array controls when it re-runs. An empty array [] runs once on mount. No array runs after every render (almost never correct). Always return a cleanup function to unsubscribe or clear timers.

useRef has two uses: (1) hold a reference to a DOM element without causing re-renders when accessed, (2) store a mutable value that persists across renders but doesn't trigger re-renders (like a previous value, or a timer ID).

useMemo memoizes an expensive computed value, recalculating only when dependencies change. useCallback memoizes a function reference — critical when passing callbacks to React.memo-wrapped children to prevent unnecessary re-renders.

Rules of Hooks: only call hooks at the top level (not inside conditions or loops), and only in React function components or custom hooks.`,
        code: `// useState — functional update prevents stale closure
const [count, setCount] = useState(0)
setCount(prev => prev + 1)  // always correct even with batching

// useState with complex type
const [user, setUser] = useState<User | null>(null)

// useEffect — cleanup is critical
useEffect(() => {
  const sub = eventEmitter.subscribe(handleEvent)
  return () => sub.unsubscribe()  // runs before next effect or unmount
}, [])  // empty array: once on mount

useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])  // re-runs only when count changes

// useRef — DOM reference
const inputRef = useRef<HTMLInputElement>(null)
const focus = () => inputRef.current?.focus()

// useRef — mutable value (no re-render on change)
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

// useMemo — expensive computation
const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items]
)

// useCallback — stable function for memoized children
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id))
}, [])  // no dependencies — function never recreated`,
        codeLang: 'typescript',
        tags: ['React'],
        youtubeQueries: ['React hooks explained useState useEffect useMemo useCallback'],
      },
      {
        id: 'reconciliation',
        title: 'React Reconciliation & Virtual DOM',
        teaser: 'How React updates only what changed — not the entire DOM.',
        explanation: `The Virtual DOM is a lightweight JavaScript object tree mirroring the real DOM. When state changes, React builds a new virtual DOM tree and diffs it against the previous one. This process is called reconciliation. React calculates the minimum set of DOM operations needed and applies only those.

This is faster because JavaScript comparisons are cheap; actual DOM manipulation (causing reflow and repaint) is expensive.

The diffing algorithm makes two assumptions for speed: elements of different types produce entirely different trees (React unmounts and remounts them), and keys identify stable list items across renders.

Keys are critical in lists. Without stable keys (or with index keys on reorderable lists), React cannot correctly match old and new items — it may update wrong elements or destroy and recreate state unnecessarily. Always use a stable, unique identifier like a database ID.

React Fiber (introduced in React 16): breaks rendering into small interruptible units of work, enabling Concurrent Mode features like useTransition and Suspense.`,
        analogy: "Virtual DOM diffing is like a 'spot the difference' puzzle. Instead of redrawing the full picture when something changes, you compare old and new, find only the differences, and patch just those spots.",
        code: `// Keys in lists — critical for correct reconciliation

// ❌ Index as key: breaks when list is filtered, sorted, or items are removed
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}

// ✅ Stable ID as key
{items.map(item => (
  <TodoItem key={item.id} item={item} />
))}

// useTransition — defer non-urgent updates (React 18+)
import { useTransition, useState } from 'react'

function SearchPage() {
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  function handleSearch(value: string) {
    setQuery(value)  // urgent: update input immediately

    startTransition(() => {
      // non-urgent: React can defer this if the user keeps typing
      setResults(searchDatabase(value))
    })
  }

  return (
    <>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </>
  )
}`,
        codeLang: 'typescript',
        tags: ['React', 'Performance'],
        youtubeQueries: ['React reconciliation virtual DOM explained'],
      },
      {
        id: 'custom-hooks',
        title: 'Custom Hooks',
        teaser: 'Extract stateful logic into reusable functions — the React pattern for sharing logic.',
        explanation: `Custom hooks are functions that start with "use" and can call other React hooks inside. They let you extract component logic into reusable units.

Important: hooks share logic, not state. Each component that calls a custom hook gets its own independent state. There is no shared state between callers unless you use a global store.

Common patterns include useDebounce (delay rapidly-changing values), useLocalStorage (persist state across reloads), useFetch (data fetching with loading and error states), useClickOutside (detect clicks outside a ref), and useMediaQuery (react to viewport changes).`,
        code: `// useDebounce — wait for input to settle before acting
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// Usage: search input that only queries after 300ms pause
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)
useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery)
}, [debouncedQuery])

// useLocalStorage — state that survives page reloads
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch { return initialValue }
  })
  const setValue = (value: T) => {
    setStored(value)
    localStorage.setItem(key, JSON.stringify(value))
  }
  return [stored, setValue] as const
}

// useClickOutside — close a dropdown when clicking outside
function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}`,
        codeLang: 'typescript',
        tags: ['React'],
        youtubeQueries: ['React custom hooks tutorial'],
      },
      {
        id: 'context',
        title: 'React Context API',
        teaser: 'Share state across deeply nested components without prop drilling.',
        explanation: `Context provides a way to pass data through the component tree without passing props at every level. Create a context with createContext, wrap your component tree in a Provider, and consume it anywhere below with useContext.

Best use cases: authentication state, theme (light/dark), locale, feature flags — global values that rarely change.

Performance pitfall: when the context value changes, every component that consumes that context re-renders. To prevent this, memoize the value object with useMemo, and split large contexts into smaller focused ones. Components subscribed to an AuthContext should not re-render just because the theme changed.

When not to use: for frequently-updating state (search input, scroll position), use a purpose-built store like Zustand instead.`,
        code: `// 1. Create the context
interface AuthContextValue {
  user: User | null
  login: (creds: Credentials) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

// 2. Provide it near the root
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (creds: Credentials) => {
    const u = await api.login(creds)
    setUser(u)
  }, [])

  const logout = useCallback(() => { setUser(null); api.logout() }, [])

  // Memoize to prevent re-renders when the provider's parent re-renders
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 3. Custom hook with null guard (better DX than raw useContext)
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// 4. Consume anywhere — no props needed
function NavBar() {
  const { user, logout } = useAuth()
  return <button onClick={logout}>{user?.name ?? 'Login'}</button>
}`,
        codeLang: 'typescript',
        tags: ['React'],
        youtubeQueries: ['React context API tutorial'],
      },
      {
        id: 'react-performance',
        title: 'React Performance Optimization',
        teaser: 'Prevent unnecessary re-renders — the most common React performance problem.',
        explanation: `A React component re-renders when: its state changes, its props change, or its parent re-renders. Even if the component's output doesn't change, React will diff the virtual DOM output. For large trees this adds up.

React.memo wraps a component and skips re-rendering if props haven't changed (shallow comparison). It only helps if the component's parent re-renders frequently AND the component's own output is expensive to compute.

For React.memo to work on a component receiving a callback prop, the callback must have a stable reference — otherwise a new function object is created on each parent render, making memo useless. That's exactly what useCallback solves.

Profile before optimizing: use React DevTools Profiler to identify which components are actually slow. Premature memoization adds overhead without benefit.

For long lists (1000+ items), don't render all items — use virtualization. Libraries: react-window or TanStack Virtual render only the visible rows.`,
        code: `import { memo, useMemo, useCallback } from 'react'

// React.memo — skip re-render if props are identical (shallow)
const ExpensiveList = memo(function ExpensiveList({
  items, onDelete
}: { items: Item[]; onDelete: (id: string) => void }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>×</button>
        </li>
      ))}
    </ul>
  )
})

function Parent() {
  const [items, setItems] = useState(initialItems)
  const [counter, setCounter] = useState(0)

  // useCallback: stable reference — ExpensiveList skips re-render
  // when counter changes (counter not used in this callback)
  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  // useMemo: filter runs only when items changes
  const active = useMemo(() => items.filter(i => i.active), [items])

  return (
    <>
      <button onClick={() => setCounter(c => c + 1)}>Counter: {counter}</button>
      <ExpensiveList items={active} onDelete={handleDelete} />
      {/* ↑ does NOT re-render when counter changes */}
    </>
  )
}`,
        codeLang: 'typescript',
        tags: ['React', 'Performance'],
        youtubeQueries: ['React performance optimization'],
      },
      {
        id: 'server-components',
        title: 'React Server Components',
        teaser: 'Components that run on the server — fetch data directly, send zero JS to the client.',
        explanation: `React Server Components (RSC) are a paradigm shift. In Next.js App Router, all components are Server Components by default. They run only on the server, can access databases and environment secrets directly, and send rendered HTML — not JavaScript — to the client. They have zero impact on the client JS bundle.

The 'use client' directive marks a component as a Client Component. Client components run on both server (initial HTML) and client (hydration and interactivity). They can use useState, useEffect, event handlers, and browser APIs. They add to the JS bundle.

Decision rule: default to Server Components. Add 'use client' only when you need interactivity (onClick, onChange) or browser-only APIs (localStorage, window). The common pattern is: Server Component fetches and transforms data → passes it as props to a small Client Component that handles the interactive UI.`,
        code: `// app/dashboard/page.tsx — Server Component (no 'use client')
// Runs ONLY on the server. Can await directly. No useEffect. No bundle cost.
async function DashboardPage() {
  // Direct DB call — no API route needed. Secret stays on server.
  const [stats, user] = await Promise.all([
    db.query('SELECT * FROM analytics WHERE date > NOW() - INTERVAL 7 DAY'),
    getCurrentUser(),  // reads server-side session cookie
  ])

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <StatsGrid stats={stats} />          {/* Server Component — no JS */}
      <InteractiveChart initialData={stats} /> {/* Client Component */}
    </main>
  )
}

// components/InteractiveChart.tsx — Client Component
'use client'

export function InteractiveChart({ initialData }: { initialData: Stats[] }) {
  const [metric, setMetric] = useState<'pageViews' | 'sessions'>('pageViews')

  return (
    <div>
      <select onChange={e => setMetric(e.target.value as any)}>
        <option value="pageViews">Page Views</option>
        <option value="sessions">Sessions</option>
      </select>
      <Chart data={initialData} metric={metric} />
    </div>
  )
}`,
        codeLang: 'typescript',
        tags: ['React', 'Next.js'],
        youtubeQueries: ['React server components explained'],
      },
    ],
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    icon: Zap,
    topics: [
      {
        id: 'app-router',
        title: 'Next.js App Router',
        teaser: 'File-system routing with layouts, loading states, and Server Components by default.',
        explanation: `The App Router uses the app/ directory. Each folder is a route segment. Special files define behavior at each route:

page.tsx renders the route UI and makes it publicly accessible. layout.tsx wraps child pages with shared UI — it does not re-mount on navigation, so sidebar and navbar state persists. loading.tsx automatically wraps the page in a Suspense boundary and shows a skeleton while async data loads. error.tsx catches thrown errors (must be a Client Component — it uses lifecycle hooks). not-found.tsx renders when notFound() is called.

Route conventions: app/blog/[slug]/page.tsx creates a dynamic route at /blog/:slug. Wrapping a folder in parentheses like app/(marketing)/page.tsx creates a route group — it doesn't affect the URL but lets you share a different layout. The @folder convention creates parallel routes — two routes displayed simultaneously.`,
        code: `// File structure → URL mapping
// app/page.tsx                      → /
// app/blog/page.tsx                 → /blog
// app/blog/[slug]/page.tsx          → /blog/:slug
// app/(auth)/login/page.tsx         → /login  (group doesn't appear in URL)
// app/blog/[...slug]/page.tsx       → /blog/* (catch-all)

// app/blog/[slug]/page.tsx — async dynamic page
interface PageProps { params: Promise<{ slug: string }> }

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params  // params are async in Next.js 15
  const post = await db.post.findUnique({ where: { slug } })

  if (!post) notFound()  // triggers not-found.tsx

  return <article dangerouslySetInnerHTML={{ __html: post.content }} />
}

// Statically generate all known slugs at build time
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } })
  return posts.map(p => ({ slug: p.slug }))
}

// app/blog/[slug]/loading.tsx — shown while page awaits data
export default function Loading() {
  return <div className="animate-pulse h-96 bg-surface rounded-xl" />
}

// app/blog/[slug]/error.tsx — must be 'use client'
'use client'
export default function Error({ reset }: { reset: () => void }) {
  return <button onClick={reset}>Something went wrong — retry</button>
}`,
        codeLang: 'typescript',
        tags: ['Next.js'],
        youtubeQueries: ['Next.js App Router tutorial', 'Next.js 15 full course'],
      },
      {
        id: 'server-actions',
        title: 'Next.js Server Actions',
        teaser: 'Run server-side mutations from forms and client components — no API routes needed.',
        explanation: `Server Actions are async functions marked with the 'use server' directive. They execute on the server and can be called directly from forms or Client Components. No fetch, no API route, no JSON serialization in your component code.

Progressive enhancement: when used as a form action, the form works even without JavaScript (native HTML POST behavior). React enhances it when JS loads.

After a mutation, call revalidatePath('/route') to clear the Next.js cache for affected pages, or revalidateTag('tag') for fine-grained cache invalidation. Call redirect('/path') to navigate the user after a successful mutation.

Security note: Server Actions are automatically protected against CSRF by Next.js. They are still server functions — validate all inputs with Zod before trusting them.`,
        code: `// app/actions/post.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const CreatePostSchema = z.object({
  title:   z.string().min(1).max(200),
  content: z.string().min(10),
})

export async function createPost(formData: FormData) {
  const parsed = CreatePostSchema.safeParse({
    title:   formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const userId = await getAuthenticatedUserId()  // server-side session
  const post = await db.post.create({
    data: { ...parsed.data, authorId: userId }
  })

  revalidatePath('/blog')          // clear blog list cache
  redirect(\`/blog/\${post.slug}\`)  // navigate to new post
}

// Server Component form — no 'use client' needed
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" rows={8} required />
      <button type="submit">Publish</button>
    </form>
  )
}`,
        codeLang: 'typescript',
        tags: ['Next.js'],
        youtubeQueries: ['Next.js server actions tutorial'],
      },
      {
        id: 'rendering-strategies',
        title: 'ISR, SSR, SSG, and CSR Explained',
        teaser: 'Four rendering strategies — choose based on how fresh your data needs to be.',
        explanation: `In Next.js App Router, the rendering strategy is controlled by the fetch() cache option, not a special function or flag.

SSG (Static Site Generation): data fetched once at build time. The resulting HTML is served from a CDN. Fastest possible load. Use for marketing pages, blog posts, documentation. fetch(url) with default caching.

SSR (Server-Side Rendering): data fetched fresh on every request. Always up to date but slower (server work per visit). Use for dashboards, user-specific pages. fetch(url, { cache: 'no-store' }).

ISR (Incremental Static Regeneration): cached like SSG but automatically revalidated after N seconds. Background revalidation — users always get a cached response, the refresh happens silently. Best of both worlds. fetch(url, { next: { revalidate: 60 } }).

CSR (Client-Side Rendering): page shell sent from server, data fetched in the browser. Use for highly interactive, real-time, or user-specific UIs. Requires 'use client' and TanStack Query or useEffect.`,
        code: `// SSG — built once at deploy, served from CDN
async function BlogListPage() {
  const posts = await fetch('https://cms.example.com/posts')
    .then(r => r.json())  // cached by Next.js (default behaviour)
  return <PostList posts={posts} />
}

// SSR — fresh every request
async function DashboardPage() {
  const data = await fetch('https://api.example.com/live', {
    cache: 'no-store'
  }).then(r => r.json())
  return <Dashboard data={data} />
}

// ISR — revalidate every 60 seconds in the background
async function PricingPage() {
  const plans = await fetch('https://api.example.com/plans', {
    next: { revalidate: 60 }
  }).then(r => r.json())
  return <PlanGrid plans={plans} />
}

// On-demand revalidation via tag — call from a webhook or CMS trigger
async function getProduct(id: string) {
  return fetch(\`/api/products/\${id}\`, {
    next: { tags: [\`product-\${id}\`] }
  }).then(r => r.json())
}

// Server Action: update DB then bust the cache for that product
async function updateProduct(id: string, data: Partial<Product>) {
  'use server'
  await db.product.update({ where: { id }, data })
  revalidateTag(\`product-\${id}\`)
}`,
        codeLang: 'typescript',
        tags: ['Next.js'],
        youtubeQueries: ['Next.js ISR SSR SSG explained'],
      },
    ],
  },
  {
    id: 'state',
    label: 'State Management',
    icon: Database,
    topics: [
      {
        id: 'zustand',
        title: 'Zustand',
        teaser: 'Minimal global state — a store is just a hook. No providers, no boilerplate.',
        explanation: `Zustand is a lightweight state management library. Define the store once with create(), consume it as a hook anywhere in your app — no provider wrapping required.

Selective subscriptions: components subscribe to a slice of the store using a selector. The component re-renders only when that slice changes, not when any unrelated part of the store updates. This is better than Context, where all consumers re-render on any value change.

Devtools and persist middleware: wrappers that plug into the store for Redux DevTools integration and automatic localStorage persistence.

Access outside React: useStore.getState() and useStore.setState() work outside components — useful for calling from event handlers, utilities, or test setups.`,
        code: `import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) =>
          set(state => {
            const existing = state.items.find(i => i.id === item.id)
            if (existing) {
              return { items: state.items.map(i =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              )}
            }
            return { items: [...state.items, item] }
          }),
        removeItem: (id) =>
          set(state => ({ items: state.items.filter(i => i.id !== id) })),
        total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      }),
      { name: 'cart' }  // persists to localStorage under key 'cart'
    )
  )
)

// Component — re-renders ONLY when items changes (not total)
function CartCount() {
  const count = useCartStore(state => state.items.length)
  return <span>{count}</span>
}`,
        codeLang: 'typescript',
        tags: ['State Management'],
        youtubeQueries: ['Zustand tutorial'],
      },
      {
        id: 'redux-toolkit',
        title: 'Redux Toolkit',
        teaser: 'Modern Redux — createSlice eliminates the boilerplate, Immer handles immutability.',
        explanation: `Redux Toolkit (RTK) is the official way to write Redux in 2024. It solves the classic complaints: createSlice combines actions and reducer in one place, Immer lets you write "mutating" code that is actually immutable under the hood, and configureStore sets up the store with sane defaults.

useSelector reads state inside components. useDispatch dispatches actions. RTK Query is a built-in data fetching layer that replaces repetitive useState+useEffect patterns for server data — think of it as a simpler alternative to TanStack Query when you're already using Redux.

When to choose Redux over Zustand: very large teams where strict action patterns prevent divergence, apps that need time-travel debugging, or existing codebases already using Redux that you're extending.`,
        code: `// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem { id: string; name: string; qty: number; price: number }
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const ex = state.items.find(i => i.id === action.payload.id)
      ex ? ex.qty++ : state.items.push(action.payload)
      // Immer makes this "mutation" actually immutable behind the scenes
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
  },
})

export const { addItem, removeItem } = cartSlice.actions

// store.ts
import { configureStore } from '@reduxjs/toolkit'
export const store = configureStore({ reducer: { cart: cartSlice.reducer } })
export type RootState = ReturnType<typeof store.getState>

// Component
import { useSelector, useDispatch } from 'react-redux'
function CartItem({ id }: { id: string }) {
  const item = useSelector((s: RootState) => s.cart.items.find(i => i.id === id))
  const dispatch = useDispatch()
  return (
    <div>
      {item?.name}
      <button onClick={() => dispatch(removeItem(id))}>Remove</button>
    </div>
  )
}`,
        codeLang: 'typescript',
        tags: ['State Management'],
        youtubeQueries: ['Redux toolkit tutorial'],
      },
      {
        id: 'state-comparison',
        title: 'Context vs Zustand vs Redux',
        teaser: 'Match the tool to the complexity of your state — most apps need far less than Redux.',
        explanation: `React Context: free, built-in. Use for low-frequency global values like theme, auth status, locale. Problem: all consumers re-render when the context value changes. Fine for state that changes at most a few times per session.

Zustand: ~1KB, no provider needed, selective subscriptions. Use for shared client UI state that changes more frequently — shopping cart, modal state, filter selections, user preferences. The recommended default for most projects.

Redux Toolkit: heavier, more structured, strict action patterns. Use when you have large teams that need strict patterns to prevent divergence, when you need time-travel debugging, or when you're on a codebase that already uses Redux.

TanStack Query or SWR: for server state — data fetched from an API. This is a completely separate concern from client state. Never put API responses in Zustand or Redux. Server state has different requirements: caching, background refetching, stale-while-revalidate, deduplication.`,
        tags: ['State Management'],
        youtubeQueries: ['when to use Redux vs Context API'],
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Activity,
    topics: [
      {
        id: 'web-vitals',
        title: 'Core Web Vitals',
        teaser: "Google's user experience metrics that affect SEO rankings.",
        explanation: `Core Web Vitals are Google's standardized metrics for real-world user experience. They affect both user satisfaction and search rankings.

LCP (Largest Contentful Paint): time until the largest visible image or text block appears. Target under 2.5 seconds. Usually the hero image or main heading. Fix by preloading the LCP image (rel="preload" or Next.js Image priority prop), serving optimized formats (WebP/AVIF), using a CDN, and removing render-blocking resources.

CLS (Cumulative Layout Shift): measures how much content shifts unexpectedly during load. Target under 0.1. Fix by always setting explicit width and height on images and videos, never injecting content above existing content without reserving space, using font-display: optional to prevent font-swap shifts.

INP (Interaction to Next Paint, replaced FID in 2024): time from user interaction to visible response. Target under 200ms. Fix by breaking up long JavaScript tasks, using web workers for CPU-intensive work, and reducing third-party script impact.`,
        code: `// Measure in Next.js
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // metric.name: 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'FCP'
    // metric.rating: 'good' | 'needs-improvement' | 'poor'
    analytics.track('web-vital', { name: metric.name, value: metric.value, rating: metric.rating })
  })
  return null
}

// Fix LCP: preload the hero image
import Image from 'next/image'

function Hero() {
  return (
    <Image
      src="/hero.webp"
      width={1200}
      height={600}
      priority  // preloads this image — use ONLY for above-the-fold images
      alt="Hero"
    />
  )
}

/* Fix CLS: always set image dimensions */
/* ❌ no dimensions — browser doesn't reserve space */
<img src="/photo.jpg" />

/* ✅ dimensions prevent layout shift */
<img src="/photo.jpg" width="800" height="600" />

/* Fix CLS: reserve space for async content */
.skeleton { height: 200px; background: #eee; border-radius: 8px; }`,
        codeLang: 'typescript',
        tags: ['Performance', 'SEO'],
        youtubeQueries: ['web vitals LCP CLS FID explained'],
      },
      {
        id: 'code-splitting',
        title: 'Code Splitting & Lazy Loading',
        teaser: "Load JavaScript only when it's needed — not all upfront.",
        explanation: `Every byte of JavaScript must be downloaded, parsed, and compiled before it can run. Large bundles directly increase Time to Interactive. Code splitting breaks the bundle into smaller chunks that load on demand.

React.lazy() + Suspense: the component's JavaScript chunk is downloaded only when the component is first rendered. Wrap in Suspense to show a fallback while it loads.

Next.js dynamic(): the Next.js equivalent of React.lazy, with extra options like ssr: false for browser-only libraries (Mapbox, markdown editors). Route-level splitting is automatic — each page is its own chunk.

Tree shaking: when you use named imports from an ESM package, bundlers eliminate the parts you didn't import. This only works with ES module builds. CJS (require/module.exports) cannot be tree-shaken. Prefer lodash-es over lodash, date-fns over moment.`,
        code: `// React.lazy — load component only when it's rendered
const HeavyModal   = React.lazy(() => import('./HeavyModal'))
const ChartSection = React.lazy(() => import('./ChartSection'))

function App() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open</button>

      {/* Chunk downloaded only when button is clicked */}
      <Suspense fallback={<div>Loading...</div>}>
        {showModal && <HeavyModal />}
      </Suspense>

      {/* Loaded in background after initial paint */}
      <Suspense fallback={<ChartSkeleton />}>
        <ChartSection />
      </Suspense>
    </>
  )
}

// Next.js dynamic — SSR disabled for browser-only libraries
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

// Tree shaking — named imports from ESM builds
import { debounce } from 'lodash-es'  // ✅ only imports debounce (~2KB)
// import _ from 'lodash'             // ❌ entire 70KB library`,
        codeLang: 'typescript',
        tags: ['Performance'],
        youtubeQueries: ['code splitting lazy loading React'],
      },
      {
        id: 'bundle-optimization',
        title: 'Bundle Size Optimization',
        teaser: 'Analyze and shrink your JavaScript bundle for faster load times.',
        explanation: `Bundle size directly impacts load time and Time to Interactive, especially on mobile and slow connections.

Analyze first — never optimize blind: @next/bundle-analyzer generates a visual treemap of your bundle. bundlephobia.com shows the cost of any npm package before you install it. Chrome DevTools Coverage tab shows unused JavaScript.

Common wins: replace moment.js (67KB gzipped) with date-fns (tree-shakeable, ~2KB per function). Replace full lodash with lodash-es or native array/object methods. Dynamically import large optional features (rich text editors, chart libraries) only when needed.

Images: Next.js Image component automatically converts to WebP/AVIF, generates responsive srcset, applies lazy loading, and prevents CLS with placeholder blurs.

Self-host fonts: loading from Google Fonts adds a network round trip. Next.js font optimization (next/font) downloads and self-hosts fonts at build time with zero layout shift.`,
        code: `// next.config.js — bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})
// Run: ANALYZE=true npm run build

// Replace heavy libraries
// ❌ moment — 67KB gzipped
import moment from 'moment'
moment(date).format('MMM D, YYYY')

// ✅ date-fns — import only what you use
import { format } from 'date-fns'
format(date, 'MMM d, yyyy')  // ~2KB

// Dynamic import for heavy optional features
import dynamic from 'next/dynamic'
const RichEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

// Optimized images — automatic WebP, lazy load, responsive srcset
import Image from 'next/image'
<Image
  src="/product.jpg"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  placeholder="blur"
  alt="Product"
/>

// Self-hosted fonts — zero CLS, zero Google roundtrip
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function Layout({ children }) {
  return <html className={inter.className}>{children}</html>
}`,
        codeLang: 'typescript',
        tags: ['Performance'],
        youtubeQueries: ['bundle size optimization JavaScript'],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data & APIs',
    icon: Wifi,
    topics: [
      {
        id: 'tanstack-query',
        title: 'TanStack Query (React Query)',
        teaser: 'Server state management — caching, background refetching, and sync handled automatically.',
        explanation: `TanStack Query manages server state: data fetched from an external API that needs to stay in sync with the UI. Without it you write useState + useEffect + loading/error booleans + cache invalidation by hand — fragile, verbose, and full of subtle bugs.

useQuery fetches and caches data identified by a query key. The same key across different components shares the same cached data and deduplicates requests. Data becomes "stale" after staleTime milliseconds (default: 0), triggering a background refetch when the component mounts or the window refocuses.

useMutation is for POST/PUT/DELETE operations. After a successful mutation, call queryClient.invalidateQueries() to mark related data as stale and trigger a refetch — this is how you keep the UI in sync with the server without manual state management.`,
        code: `// Setup in app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 2 } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

// useQuery — fetch and cache
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],       // cache key — same key = shared cache
    queryFn: () => api.getUser(userId),
    enabled: !!userId,                // don't run if userId is undefined
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorState error={error} />
  return <div>{user?.name}</div>
}

// useMutation — mutate with cache invalidation
function CreatePostForm() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: CreatePostData) => api.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })  // refetch list
    },
    onError: (err) => toast.error(err.message),
  })

  return (
    <button
      onClick={() => mutation.mutate({ title: 'Hello' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Creating...' : 'Create Post'}
    </button>
  )
}`,
        codeLang: 'typescript',
        tags: ['Data Fetching'],
        youtubeQueries: ['React Query TanStack Query tutorial'],
      },
      {
        id: 'websockets',
        title: 'WebSockets',
        teaser: 'Persistent bidirectional connection for real-time data — no polling required.',
        explanation: `HTTP is request-response: the client asks, the server answers, connection closes. The server cannot push data without a client request first.

WebSockets solve this with a persistent, bidirectional TCP connection that stays open. Either side can send data at any time. The connection starts as HTTP and upgrades via the Upgrade: websocket header.

Use cases: live chat, real-time notifications, collaborative editing (Google Docs-style), live sports scores, stock tickers, multiplayer games.

Socket.io is the production standard over raw WebSocket. It adds automatic reconnection, event-based API, rooms (group broadcast), namespaces, and fallback transports for environments where WebSocket is blocked.

When you only need server-to-client push (and clients don't send events), use Server-Sent Events (SSE) instead — it's simpler and uses regular HTTP.`,
        code: `// Socket.io server (Node.js)
import { Server } from 'socket.io'
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } })

io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-joined', { id: socket.id })
  })

  socket.on('send-message', (msg: ChatMessage) => {
    // Broadcast to everyone in the room except the sender
    socket.to(msg.roomId).emit('new-message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
  })
})

// React client hook
import { io, Socket } from 'socket.io-client'

function useSocket(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!)
    socketRef.current = socket

    socket.emit('join-room', roomId)
    socket.on('new-message', (msg) => setMessages(prev => [...prev, msg]))

    return () => { socket.disconnect() }  // cleanup on unmount
  }, [roomId])

  const sendMessage = (text: string) => {
    socketRef.current?.emit('send-message', { roomId, text, timestamp: Date.now() })
  }

  return { messages, sendMessage }
}`,
        codeLang: 'typescript',
        tags: ['APIs', 'Real-time'],
        youtubeQueries: ['WebSockets crash course'],
      },
      {
        id: 'trpc',
        title: 'tRPC',
        teaser: 'End-to-end type-safe APIs — call server functions from the client like regular TypeScript.',
        explanation: `tRPC lets you build APIs without schemas or code generation. You write a TypeScript function on the server; the client calls it with full type safety — TypeScript types flow automatically from server to client via inference.

There is no REST endpoint, no JSON schema, no OpenAPI spec to maintain. If you rename an input field on the server, the client immediately shows a type error. Zero runtime overhead for the type sharing — it's all compile-time inference.

Procedures come in two flavors: query (read, like GET) and mutation (write, like POST/PUT/DELETE). Input validation is done with Zod. Protected procedures receive the authenticated user via a context object.

Best fit: Next.js full-stack monorepo where you own both client and server. Not suitable for public APIs consumed by third parties or non-TypeScript clients.`,
        code: `// server/trpc.ts — initialize tRPC
import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.context<Context>().create()
export const router = t.router
export const publicProcedure    = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.userId } })
})

// server/routers/post.ts
export const postRouter = router({
  list: publicProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ input }) =>
      db.post.findMany({ skip: (input.page - 1) * 10, take: 10 })
    ),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string() }))
    .mutation(async ({ input, ctx }) =>
      db.post.create({ data: { ...input, authorId: ctx.userId } })
    ),
})

// Client component — fully typed, zero boilerplate
import { trpc } from '@/lib/trpc'

function PostList() {
  const { data } = trpc.post.list.useQuery({ page: 1 })

  const create = trpc.post.create.useMutation({
    onSuccess: () => trpc.post.list.invalidate(),
  })

  // create.mutate({ title: 123 })  ❌ TypeScript error: expected string
  return <div>{data?.map(p => <p key={p.id}>{p.title}</p>)}</div>
}`,
        codeLang: 'typescript',
        tags: ['APIs', 'TypeScript'],
        youtubeQueries: ['tRPC explained'],
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

            {topic.youtubeQueries && topic.youtubeQueries.length > 0 && (
              <div>
                <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">YouTube Resources</p>
                <div className="flex flex-col gap-1.5">
                  {topic.youtubeQueries.map(q => (
                    <a
                      key={q}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-text-muted hover:text-red-400 transition-colors group"
                    >
                      <span className="text-red-500 flex-shrink-0 text-base leading-none">▶</span>
                      <span className="group-hover:underline">{q}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FrontendPage() {
  const [activeCategory, setActiveCategory] = useState('typescript')
  const current = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Frontend Development"
        subtitle="TypeScript, browser internals, HTML/CSS, React, Next.js, state management, performance, and data fetching — everything the modern frontend stack demands."
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
