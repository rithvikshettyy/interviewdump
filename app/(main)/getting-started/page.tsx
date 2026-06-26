'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  Globe,
  FileText,
  Palette,
  Zap,
  Server,
  Rocket,
  Map,
  ChevronDown,
  ChevronUp,
  Code2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CodeBlock {
  language: string
  code: string
}

interface Section {
  id: string
  icon: React.ElementType
  title: string
  difficulty: 'Beginner' | 'Easy' | 'Medium'
  readTime: string
  teaser: string
  explanation: string
  analogy: string
  code?: CodeBlock
  keyPoints: string[]
  nextStep: string
}

// ── Content ───────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    id: 'web',
    icon: Globe,
    title: 'What is the Web?',
    difficulty: 'Beginner',
    readTime: '4 mins',
    teaser: 'How does typing a URL give you a webpage? The full journey explained.',
    explanation:
      'The Web is a system of interconnected documents (web pages) that live on computers called servers around the world. When you type a URL like google.com into a browser, your computer sends a request over the internet to Google\'s server. The server finds the right files, and sends them back. Your browser reads those files and draws the page you see.\n\nThink of it as three main players: (1) the Client — your browser, (2) the Server — a computer somewhere holding the files, and (3) the Internet — the network connecting them.',
    analogy:
      'Imagine ordering food at a restaurant. You (the client/browser) tell the waiter your order (HTTP request). The kitchen (server) prepares the food (HTML, CSS, JS files) and the waiter delivers it back to your table. You then eat it (browser renders the page).',
    code: {
      language: 'text',
      code: `You type: https://google.com
  ↓
Browser asks: "Where is google.com?" (DNS lookup)
  ↓
DNS replies: "It's at IP 142.250.x.x"
  ↓
Browser sends: GET / HTTP/1.1 to that IP
  ↓
Google's server replies with HTML file
  ↓
Browser reads HTML → fetches CSS + JS → renders page`,
    },
    keyPoints: [
      'The browser is called the "client" — it requests pages.',
      'Web pages live on "servers" — computers always connected to the internet.',
      'HTTP/HTTPS is the language browsers and servers use to talk.',
      'DNS is like a phonebook — turns domain names into IP addresses.',
    ],
    nextStep: 'Now that you know how the web works, learn what those HTML files actually look like.',
  },
  {
    id: 'html',
    icon: FileText,
    title: 'HTML — The Skeleton',
    difficulty: 'Beginner',
    readTime: '5 mins',
    teaser: 'HTML is the structure of every webpage. It tells the browser what content exists.',
    explanation:
      'HTML (HyperText Markup Language) is the language used to create the structure of a webpage. It\'s not a programming language — it\'s a markup language, meaning you use tags to label content.\n\nTags wrap content like this: <tagname>content</tagname>. The browser reads these tags and knows what each piece of content is — a heading, a paragraph, an image, a link.',
    analogy:
      'HTML is like the frame of a house. It defines where the rooms are, where the doors go, where the windows are — but it has no paint or furniture yet. That\'s CSS\'s job.',
    code: {
      language: 'html',
      code: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph of text.</p>
    <a href="https://google.com">Click me!</a>
    <img src="photo.jpg" alt="A photo" />
  </body>
</html>`,
    },
    keyPoints: [
      '<html> wraps the entire page.',
      '<head> holds metadata (title, links to CSS) — not visible on page.',
      '<body> holds everything the user sees.',
      'Tags come in pairs: <p> opens, </p> closes. Some are self-closing: <img />.',
    ],
    nextStep: 'Your page has structure — now style it with CSS.',
  },
  {
    id: 'css',
    icon: Palette,
    title: 'CSS — The Styling',
    difficulty: 'Beginner',
    readTime: '5 mins',
    teaser: 'CSS makes your page look good — colors, fonts, layout, spacing.',
    explanation:
      'CSS (Cascading Style Sheets) controls how HTML elements look. You write rules that target HTML elements and describe how they should appear: color, size, font, spacing, position.\n\nA CSS rule has two parts: a selector (which element to style) and declarations (what to change). Cascading means multiple rules can apply to the same element — the most specific one wins.',
    analogy:
      'If HTML is the house frame, CSS is the paint, wallpaper, furniture, and lighting. You tell each room (HTML element) what color the walls should be, how big the windows are, where the couch goes.',
    code: {
      language: 'css',
      code: `/* Target the h1 tag and style it */
h1 {
  color: #6366f1;       /* indigo text */
  font-size: 32px;
  font-weight: bold;
}

/* Target elements with class="card" */
.card {
  background-color: #1e1e2e;
  border-radius: 12px;
  padding: 20px;
  margin: 10px;
}

/* Target the element with id="hero" */
#hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`,
    },
    keyPoints: [
      'Selectors: tag name (h1), class (.card), or id (#hero).',
      'Properties: color, font-size, margin, padding, display, etc.',
      'Flexbox (display: flex) and Grid (display: grid) control layouts.',
      'CSS files are linked in HTML <head> using <link rel="stylesheet" href="style.css">.',
    ],
    nextStep: 'Your page looks great — now add interactivity with JavaScript.',
  },
  {
    id: 'javascript',
    icon: Zap,
    title: 'JavaScript — Making It Interactive',
    difficulty: 'Beginner',
    readTime: '6 mins',
    teaser: 'JS makes webpages respond to user actions — clicks, typing, animations.',
    explanation:
      'JavaScript (JS) is a real programming language that runs inside the browser. It can read and change HTML/CSS on the fly, respond to user events (click, scroll, type), fetch data from servers, and much more.\n\nThe browser gives JS access to the DOM (Document Object Model) — a representation of all the HTML on the page as objects. JS can find any element and change it.',
    analogy:
      'HTML is the house frame, CSS is the decoration — JavaScript is the electricity. It powers the lights (animations), the doorbell (click events), the air conditioning (dynamic data), and the TV (video/audio).',
    code: {
      language: 'javascript',
      code: `// Select an element from the page
const button = document.getElementById('myButton')
const message = document.getElementById('message')

// Listen for a click event
button.addEventListener('click', function() {
  message.textContent = 'You clicked the button!'
  message.style.color = '#6366f1'
})

// Fetch data from an API
async function loadUser() {
  const response = await fetch('https://api.github.com/users/torvalds')
  const data = await response.json()
  console.log(data.name)  // "Linus Torvalds"
}`,
    },
    keyPoints: [
      'JS runs in the browser — no installation needed.',
      'document.getElementById() finds an HTML element by its id.',
      'addEventListener() listens for user actions (click, keydown, submit).',
      'fetch() loads data from the internet without refreshing the page.',
      'Variables: use const (can\'t reassign) or let (can reassign).',
    ],
    nextStep: 'Browser JS is powerful — but what if you want JS on a server? That\'s Node.js.',
  },
  {
    id: 'nodejs',
    icon: Server,
    title: 'Node.js vs JavaScript',
    difficulty: 'Easy',
    readTime: '5 mins',
    teaser: 'JavaScript was born in the browser. Node.js lets it run on servers too.',
    explanation:
      'JavaScript was originally designed to run only in browsers. In 2009, Ryan Dahl took the V8 engine (Chrome\'s JS engine) and packaged it so JS could run on a computer outside the browser — this became Node.js.\n\nKey difference: Browser JS can access the DOM, browser APIs (localStorage, alert), and the user\'s tab. Node.js can access the file system, create web servers, connect to databases, and run scripts — but has no DOM or browser APIs.\n\nNode.js also introduced npm (Node Package Manager) — a registry of 1M+ open-source packages you can install and use in your code.',
    analogy:
      'JavaScript is like a chef who only works in one restaurant (the browser). Node.js hired that same chef and said "now you can cook anywhere" — at home, in a food truck, in a factory. Same skills, different environment, different tools available.',
    code: {
      language: 'javascript',
      code: `// This runs in Node.js (NOT in a browser)
const fs = require('fs')        // file system access
const http = require('http')    // create web servers

// Read a file from disk (impossible in browser JS)
const content = fs.readFileSync('hello.txt', 'utf8')
console.log(content)

// Create a basic web server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello from Node.js!')
})
server.listen(3000)
// Now visit http://localhost:3000 in your browser`,
    },
    keyPoints: [
      'Node.js = JavaScript that runs on a server/computer, not a browser.',
      'Same JS syntax, but different built-in APIs available.',
      'Use Node.js to build REST APIs, web servers, CLIs, scripts.',
      'npm install <package> installs open-source libraries.',
      'Frameworks like Express.js, Next.js, and NestJS run on Node.js.',
    ],
    nextStep: 'Now let\'s put it all together and build your first website!',
  },
  {
    id: 'first-website',
    icon: Rocket,
    title: 'Your First Website',
    difficulty: 'Easy',
    readTime: '10 mins',
    teaser: 'Build a personal intro page with HTML + CSS + JS in under 10 minutes.',
    explanation:
      'Let\'s build a simple personal page: your name, a short bio, a button that shows a fun fact, and basic styling. You only need a text editor (VS Code) and a browser.\n\nSteps:\n1. Create a folder called my-website\n2. Create index.html\n3. Create style.css\n4. Create script.js\n5. Open index.html in Chrome/Firefox',
    analogy:
      'Building your first website is like cooking instant noodles. The instructions seem complicated the first time, but once you do it — it\'s obvious and you can improvise forever after.',
    code: {
      language: 'html',
      code: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hi, I'm <span class="highlight">Your Name</span> 👋</h1>
    <p class="bio">Aspiring developer. I love building things for the web.</p>
    <button id="factBtn">Show Fun Fact</button>
    <p id="fact" class="fact"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>

/* style.css */
body {
  font-family: sans-serif;
  background: #0f0f1a;
  color: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
.container { text-align: center; max-width: 600px; padding: 40px; }
.highlight { color: #6366f1; }
button {
  background: #6366f1; color: white;
  border: none; padding: 12px 24px;
  border-radius: 8px; cursor: pointer; font-size: 16px;
}
.fact { color: #a5b4fc; margin-top: 16px; font-style: italic; }

// script.js
const facts = [
  "The first website went live in 1991.",
  "JavaScript was created in just 10 days.",
  "There are over 1.9 billion websites on the internet.",
]
document.getElementById('factBtn').addEventListener('click', () => {
  const random = facts[Math.floor(Math.random() * facts.length)]
  document.getElementById('fact').textContent = random
})`,
    },
    keyPoints: [
      'index.html is always the default page browsers load from a folder.',
      'Link CSS with <link> in <head>, link JS with <script> before </body>.',
      'Open index.html directly in Chrome — no server needed for static HTML.',
      'To share it online, use GitHub Pages (free) or Netlify (free).',
    ],
    nextStep: 'You built your first page! Now explore frameworks like React or Vue to build bigger apps.',
  },
  {
    id: 'whats-next',
    icon: Map,
    title: 'What to Learn Next',
    difficulty: 'Easy',
    readTime: '3 mins',
    teaser: 'A clear roadmap from beginner to job-ready developer.',
    explanation:
      'Web development splits into two main paths:\n\n**Frontend** — what users see. Learn: HTML → CSS → JavaScript → React → Next.js → TypeScript.\n\n**Backend** — the server side. Learn: Node.js → Express.js → Databases (PostgreSQL/MongoDB) → APIs → Auth.\n\n**Fullstack** — both. Most junior jobs want fullstack knowledge.\n\nKey skills every developer needs:\n• Git & GitHub (version control)\n• Terminal / Command Line basics\n• Reading documentation\n• Debugging (using browser DevTools)',
    analogy:
      'Think of web dev like learning to drive. HTML/CSS/JS is learning the controls. React is passing your test. Fullstack is driving on the highway. Senior dev is navigating without GPS.',
    keyPoints: [
      'Frontend path: HTML → CSS → JS → React → Next.js',
      'Backend path: Node.js → Express → SQL/NoSQL → REST APIs',
      'Always learn Git from day one — every job requires it.',
      'Build projects — a portfolio beats a certificate every time.',
      'This app has dedicated sections for each of these topics!',
    ],
    nextStep: 'Head to the Library for interview questions, or Fundamentals for language deep-dives.',
  },
]

// ── Difficulty badge ───────────────────────────────────────────────────────────

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-dim text-green border-green/20',
  Easy: 'bg-indigo-dim text-indigo-light border-indigo/20',
  Medium: 'bg-amber-dim text-amber border-amber/20',
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BeginnerBasicsPage() {
  const [activeId, setActiveId] = useState<string | null>('web')

  const active = sections.find((s) => s.id === activeId) ?? null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Beginner Basics"
        subtitle="Zero to web developer — start here if you've never written a line of code."
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* ── Left: Section List ──────────────────────────────────────────── */}
        <div className="lg:w-[320px] flex-shrink-0 flex flex-col gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeId === section.id
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(isActive ? null : section.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-150 focus:outline-none ${
                  isActive
                    ? 'bg-indigo-dim border-indigo/40 shadow-sm'
                    : 'bg-surface border-border hover:border-indigo/30 hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-indigo text-white' : 'bg-surface-hover text-text-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-text">
                          {section.title}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        {section.teaser}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            difficultyColor[section.difficulty]
                          }`}
                        >
                          {section.difficulty}
                        </span>
                        <span className="text-[10px] text-text-dim font-mono">
                          {section.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isActive ? (
                    <ChevronUp className="w-4 h-4 text-indigo flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-dim flex-shrink-0 mt-1" />
                  )}
                </div>

                {/* Mobile expand inline */}
                {isActive && (
                  <div className="lg:hidden mt-4 border-t border-border/60 pt-4">
                    <SectionDetail section={section} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Right: Detail Panel (desktop) ──────────────────────────────── */}
        <div className="hidden lg:block flex-1 min-w-0">
          {active ? (
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-6">
              <SectionDetail section={active} />
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
              <Code2 className="w-12 h-12 text-text-dim mb-4" />
              <p className="text-text-muted text-sm">Select a topic on the left to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── SectionDetail Component ───────────────────────────────────────────────────

function SectionDetail({ section }: { section: Section }) {
  const SectionIcon = section.icon
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <SectionIcon className="w-5 h-5 text-indigo flex-shrink-0" />
          <h2 className="text-xl font-bold text-text">{section.title}</h2>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              difficultyColor[section.difficulty]
            }`}
          >
            {section.difficulty}
          </span>
          <span className="text-[10px] text-text-dim font-mono">{section.readTime}</span>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <h3 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-2">Explanation</h3>
        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{section.explanation}</p>
      </div>

      {/* Analogy */}
      <div className="bg-indigo-dim border border-indigo/20 rounded-xl p-4">
        <p className="text-xs font-mono text-indigo uppercase tracking-widest mb-1">Real-world analogy</p>
        <p className="text-sm text-indigo-light leading-relaxed">{section.analogy}</p>
      </div>

      {/* Code */}
      {section.code && (
        <div>
          <h3 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-2">
            {section.id === 'first-website' ? 'Full code — 3 files' : 'Code example'}
          </h3>
          <pre className="bg-bg border border-border rounded-xl p-4 text-sm font-mono text-text-muted overflow-x-auto leading-relaxed whitespace-pre-wrap">
            <code>{section.code.code}</code>
          </pre>
        </div>
      )}

      {/* Key Points */}
      <div>
        <h3 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-2">Key takeaways</h3>
        <ul className="space-y-2">
          {section.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
              <CheckCircle2 className="w-4 h-4 text-indigo flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next step */}
      <div className="border border-border rounded-xl p-4 flex items-start gap-3 bg-surface-hover">
        <ArrowRight className="w-4 h-4 text-indigo flex-shrink-0 mt-0.5" />
        <p className="text-sm text-text-muted leading-relaxed">
          <span className="font-semibold text-text">Next: </span>
          {section.nextStep}
        </p>
      </div>
    </div>
  )
}
