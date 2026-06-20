# InterviewDump

A free, open-source interview preparation platform built for developers. Curated questions, company-specific banks, language fundamentals, DSA with explanations, algorithm visualizations, and structured study plans -- all in one place.

**Live:** [interviewdump.dev](http://www.interviewdump.dev)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Role-wise Questions** -- Position-specific questions for Backend, Frontend, ML, QA, and more.
- **Company Question Banks** -- Real interview questions from Google, Amazon, Microsoft, Flipkart, Razorpay, Meta, and others.
- **Language Fundamentals** -- JavaScript, Python, Java, and C++ concepts with code examples and mini tasks.
- **DSA Practice** -- Data structures and algorithms questions with detailed explanations.
- **Algorithm Visualizer** -- Interactive visualizations for sorting algorithms and tree traversals.
- **Core CS** -- Operating systems, networking, DBMS, and system design fundamentals.
- **SQL Practice** -- Hands-on SQL questions for interview preparation.
- **Aptitude and Logical Reasoning** -- Quantitative and logical reasoning questions with shortcuts.
- **Scenario-Based Questions** -- Real behavioral and technical scenarios from top companies.
- **Quizzes** -- Timed quiz mode across JavaScript, Python, Java, SQL, DSA, and Core CS.
- **Flashcards** -- Quick revision cards for key concepts.
- **Structured Study Plans** -- 30-day and 60-day plans for Frontend, Backend, and FAANG preparation.
- **Resume Guide** -- Role-specific resume checklists by job type and experience level.
- **Bookmarks** -- Save questions for later revision.
- **Progress Tracking** -- Track completion across all categories with streaks and insights.
- **OOP Concepts** -- Object-oriented programming fundamentals with examples.
- **Mock Tests** -- Simulated test environment for practice.
- **Google Authentication** -- Sign in with Google via Supabase Auth.

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 16 (App Router)          |
| Language      | TypeScript                        |
| Styling       | Tailwind CSS 4                    |
| Auth          | Supabase Auth (Google OAuth)      |
| Database      | Supabase (PostgreSQL)             |
| Icons         | Lucide React                      |
| Syntax        | Shiki                             |
| MDX           | next-mdx-remote                   |
| Deployment    | Vercel                            |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A Supabase project (for authentication and database)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rithvikshettyy/interviewdump.git
cd interviewdump
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## Project Structure

```
interviewdump/
├── app/
│   ├── (auth)/              # Authentication pages (login, onboarding)
│   ├── (main)/              # Authenticated app pages
│   │   ├── dashboard/       # User dashboard with progress overview
│   │   ├── fundamentals/    # Languages, OOP, quizzes, flashcards, visualizer, study plans
│   │   ├── library/         # Question banks (DSA, SQL, aptitude, company, scenario, etc.)
│   │   ├── resume/          # Resume guide
│   │   └── introduction/    # Getting started guide
│   ├── auth/                # Auth callback route
│   ├── terms/               # Terms of service
│   └── privacy/             # Privacy policy
├── components/
│   ├── layout/              # Sidebar, PageHeader, QuestionPageShell
│   ├── shared/              # Reusable UI components (SearchBar, Badge, QuestionTable, etc.)
│   └── visualizer/          # Algorithm visualization components
├── content/                 # JSON question banks and study plan data
│   ├── aptitude/            # Quantitative and logical reasoning
│   ├── companies/           # Company-specific question sets
│   ├── corecs/              # Core CS questions
│   ├── dsa/                 # Data structures and algorithms
│   ├── languages/           # Language-specific concepts (JS, Python, Java, C++)
│   ├── oops/                # OOP concepts
│   ├── plans/               # Structured study plans
│   ├── questions/           # Role-wise interview questions
│   ├── quiz/                # Quiz question sets
│   ├── scenario/            # Scenario-based questions
│   └── sql/                 # SQL questions
├── lib/
│   ├── supabase/            # Supabase client, server, and middleware config
│   ├── insights.ts          # User insights and analytics
│   ├── mocktest.ts          # Mock test logic
│   ├── progress.ts          # Progress tracking
│   ├── streak.ts            # Streak calculation
│   └── visualizer/          # Algorithm step generators for visualizations
└── public/                  # Static assets
```

---

## Contributing

Contributions are welcome. Whether it is fixing a typo, adding new questions, improving the UI, or building new features -- all help is appreciated.

### How to Contribute

1. **Fork** the repository.

2. **Create a branch** for your change:

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes.** Follow the existing code style and project conventions.

4. **Test locally** to make sure everything works:

```bash
npm run build
npm run lint
```

5. **Commit** with a clear message describing what you changed and why.

6. **Push** to your fork and open a **Pull Request** against the `main` branch.

### Contribution Ideas

- Add questions for new companies or roles
- Add support for more programming languages in the fundamentals section
- Improve algorithm visualizations or add new ones
- Write better explanations for existing questions
- Fix bugs or improve accessibility
- Add new quiz categories
- Improve mobile responsiveness

### Guidelines

- Keep PRs focused. One feature or fix per pull request.
- Do not introduce new dependencies without discussion.
- All content (questions, explanations) should be original or properly attributed.
- Follow the existing file and folder naming conventions.
- Make sure `npm run build` and `npm run lint` pass before submitting.

---

## License

This project is open source. See the repository for license details.

---

Built by [Rithvik Shetty](https://x.com/RithvikShetty04)
