'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  ChevronDown,
  ChevronUp,
  Package,
  Terminal,
  Layers,
  Network,
  LayoutGrid,
  Monitor,
  Cloud,
  DollarSign,
  Server,
  ArrowLeftRight,
  RefreshCw,
  Zap,
} from 'lucide-react'

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Category = 'Docker' | 'Kubernetes' | 'AWS' | 'Azure' | 'CI/CD'

interface Concept {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  category: Category
  difficulty: Difficulty
  what: string
  why: string
  when: string
  explanation: string
  analogy: string
  snippet?: string
  snippetLang?: string
}

const concepts: Concept[] = [
  // ── Docker ────────────────────────────────────────────────────────────────
  {
    id: 'docker-1',
    icon: Package,
    title: 'What is Docker?',
    category: 'Docker',
    difficulty: 'Easy',
    what: 'A tool that packages your app + its dependencies into a portable container.',
    why: 'Eliminates "works on my machine" problems by shipping the environment along with the code.',
    when: 'Any time you need consistent environments across dev, staging, and production.',
    explanation:
      'A container is a lightweight, standalone executable package that includes everything the app needs: code, runtime, libraries, and config. Unlike a virtual machine, containers share the host OS kernel and start in milliseconds. Docker is the most popular tool for building and running containers.',
    analogy:
      'Think of a shipping container. Before them, every port used different crates, ropes, and methods. Shipping containers standardised everything so any crane, ship, or truck can handle them. Docker does the same for software.',
    snippet: `# Dockerfile — minimal Node.js app
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
    snippetLang: 'dockerfile',
  },
  {
    id: 'docker-2',
    icon: Terminal,
    title: 'Docker Commands',
    category: 'Docker',
    difficulty: 'Easy',
    what: 'The CLI commands to build, run, and manage containers.',
    why: 'You need these daily to develop, test, and ship containerised apps.',
    when: 'Building images, starting containers, inspecting logs, cleaning up.',
    explanation:
      'docker build creates an image from a Dockerfile. docker run starts a container from an image. docker ps lists running containers. docker logs streams container output. docker exec lets you shell into a running container for debugging.',
    analogy:
      'Like git commands for code, docker commands are your control panel for containers. build = compile, run = execute, ps = list processes.',
    snippet: `# Build an image tagged "myapp:latest"
docker build -t myapp:latest .

# Run detached, map port 3000 host → 3000 container
docker run -d -p 3000:3000 --name myapp myapp:latest

# Stream logs
docker logs -f myapp

# Shell into running container
docker exec -it myapp sh

# Stop and remove
docker stop myapp && docker rm myapp`,
    snippetLang: 'bash',
  },
  {
    id: 'docker-3',
    icon: Layers,
    title: 'Docker Compose',
    category: 'Docker',
    difficulty: 'Easy',
    what: 'A YAML file that defines and runs multi-container apps with one command.',
    why: 'Real apps need a database, cache, and app server running together — Compose wires them up.',
    when: 'Local development of full-stack apps (app + Postgres + Redis, etc.).',
    explanation:
      'docker-compose.yml declares all services, their images, ports, volumes, and environment variables. `docker compose up` starts everything. `docker compose down` tears it all down. Services communicate via an internal DNS using their service names.',
    analogy:
      'Compose is a recipe card. Instead of cooking each dish separately and guessing timings, the recipe card lists all ingredients and the order to combine them.',
    snippet: `# docker-compose.yml
version: '3.9'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pg_data:/var/lib/postgresql/data
volumes:
  pg_data:`,
    snippetLang: 'yaml',
  },
  // ── Kubernetes ────────────────────────────────────────────────────────────
  {
    id: 'k8s-1',
    icon: Network,
    title: 'Why Kubernetes?',
    category: 'Kubernetes',
    difficulty: 'Medium',
    what: 'An orchestrator that manages, scales, and heals containerised apps across a cluster of machines.',
    why: 'Docker alone can run containers on one machine. K8s runs them on hundreds, handles failures, and auto-scales.',
    when: 'You have multiple services, need zero-downtime deploys, or handle variable traffic spikes.',
    explanation:
      'Kubernetes (K8s) was open-sourced by Google in 2014. It abstracts away individual servers — you declare the desired state (I want 5 replicas of this container) and K8s makes it happen and keeps it that way. If a container crashes, K8s restarts it automatically.',
    analogy:
      'Docker is like hiring a single employee. Kubernetes is like having an operations manager who hires, fires, rebalances workload across a whole team, and replaces anyone who calls in sick — automatically.',
  },
  {
    id: 'k8s-2',
    icon: LayoutGrid,
    title: 'Pods, Services & Deployments',
    category: 'Kubernetes',
    difficulty: 'Medium',
    what: 'The three core K8s building blocks you use in every application.',
    why: 'Understanding these lets you read and write K8s config for any app.',
    when: 'Every K8s deployment uses all three.',
    explanation:
      'A **Pod** is the smallest unit — one or more containers that share networking and storage. A **Deployment** manages a desired number of identical Pods and handles rollouts/rollbacks. A **Service** exposes Pods to the network, load-balancing traffic across them and giving them a stable DNS name.',
    analogy:
      'Pod = a worker. Deployment = HR policy ("always keep 3 workers"). Service = the front desk that routes calls to any available worker.',
    snippet: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
spec:
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer`,
    snippetLang: 'yaml',
  },
  {
    id: 'k8s-3',
    icon: Monitor,
    title: 'kubectl Essentials',
    category: 'Kubernetes',
    difficulty: 'Medium',
    what: 'The CLI tool to interact with a Kubernetes cluster.',
    why: 'You use kubectl to deploy, inspect, debug, and manage everything in K8s.',
    when: 'Every time you interact with a K8s cluster.',
    explanation:
      'kubectl apply -f applies a YAML config. kubectl get pods lists running pods. kubectl describe pod <name> shows detailed events — crucial for debugging CrashLoopBackOff errors. kubectl logs <pod> streams logs. kubectl rollout undo deployment/<name> rolls back a bad deploy.',
    analogy:
      'kubectl is to Kubernetes what git is to source control — the universal command-line entry point.',
    snippet: `# Apply configuration
kubectl apply -f deployment.yaml

# List pods with status
kubectl get pods -w

# Inspect a pod (great for debug)
kubectl describe pod myapp-abc123

# Stream logs
kubectl logs -f myapp-abc123

# Scale to 5 replicas
kubectl scale deployment myapp --replicas=5

# Roll back last deploy
kubectl rollout undo deployment/myapp`,
    snippetLang: 'bash',
  },
  // ── AWS ───────────────────────────────────────────────────────────────────
  {
    id: 'aws-1',
    icon: Cloud,
    title: 'AWS Core Services',
    category: 'AWS',
    difficulty: 'Medium',
    what: 'The six AWS services every developer encounters first.',
    why: 'AWS has 200+ services. Knowing these six covers 90% of SaaS app infrastructure needs.',
    when: 'When building and deploying any web application on AWS.',
    explanation:
      '**EC2** (Elastic Compute Cloud): Virtual servers. You pick CPU/RAM, install your OS, deploy your app. **S3** (Simple Storage Service): Object storage for files, images, backups, static sites. **RDS** (Relational Database Service): Managed Postgres/MySQL — no server admin. **Lambda**: Serverless functions triggered by events. **CloudFront**: CDN that caches your static assets globally. **IAM** (Identity & Access Management): Users, roles, and permissions for everything in AWS.',
    analogy:
      'EC2 = renting a computer. S3 = renting a warehouse. RDS = renting a managed database. Lambda = hiring someone only when you need them (pay per task). CloudFront = having local warehouses worldwide. IAM = the building key-card system.',
    snippet: `# AWS CLI — common operations
# List S3 buckets
aws s3 ls

# Upload file to S3
aws s3 cp build/ s3://my-bucket/ --recursive

# List EC2 instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name]'

# Invoke Lambda
aws lambda invoke --function-name myFunc output.json`,
    snippetLang: 'bash',
  },
  {
    id: 'aws-2',
    icon: DollarSign,
    title: 'AWS Free Tier',
    category: 'AWS',
    difficulty: 'Easy',
    what: 'AWS gives 12 months of limited free usage for new accounts.',
    why: 'You can build and learn on real infrastructure without spending money.',
    when: 'Starting out, side projects, prototypes.',
    explanation:
      'Free tier includes: 750 hours/month of t2.micro EC2, 5 GB of S3 storage, 25 GB of RDS db.t2.micro, 1 million Lambda invocations/month, 1 GB of CloudFront data transfer/month. Beware: costs spike quickly if you accidentally leave resources running or exceed limits. Always set a billing alert.',
    analogy:
      'Like a gym free trial — everything is available but with caps on usage. Go over, and the bill arrives fast.',
    snippet: `# Set billing alert via CLI (CloudWatch)
aws cloudwatch put-metric-alarm \\
  --alarm-name "BillingAlert" \\
  --metric-name EstimatedCharges \\
  --namespace AWS/Billing \\
  --statistic Maximum \\
  --period 86400 \\
  --threshold 10 \\
  --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:MyTopic`,
    snippetLang: 'bash',
  },
  // ── Azure ─────────────────────────────────────────────────────────────────
  {
    id: 'azure-1',
    icon: Server,
    title: 'Azure Core Services',
    category: 'Azure',
    difficulty: 'Medium',
    what: 'Microsoft\'s cloud platform — AWS equivalent services mapped to Azure names.',
    why: 'Many enterprises run on Azure due to Microsoft ecosystem (Active Directory, Office 365).',
    when: 'Enterprise clients, .NET stacks, Microsoft-first organisations.',
    explanation:
      '**Azure VMs** = EC2. **Azure Blob Storage** = S3. **Azure SQL / Cosmos DB** = RDS / DynamoDB. **Azure Functions** = Lambda. **Azure CDN** = CloudFront. **Microsoft Entra ID** (formerly Azure AD) = IAM. **App Service** = Elastic Beanstalk — managed hosting for web apps without managing VMs.',
    analogy:
      'AWS and Azure sell the same categories of cloud resources. AWS dominates market share; Azure dominates enterprise because companies already pay Microsoft for Windows and Office.',
  },
  {
    id: 'azure-2',
    icon: ArrowLeftRight,
    title: 'AWS vs Azure — When to Choose',
    category: 'Azure',
    difficulty: 'Medium',
    what: 'A practical decision framework for picking between the two.',
    why: 'The wrong choice can mean higher costs or friction with your team\'s existing tools.',
    when: 'At project start or when a client specifies a cloud provider.',
    explanation:
      'Choose **AWS** if: your team already knows it, you need the widest service variety, or you\'re building a consumer startup. Choose **Azure** if: you\'re in an enterprise that uses Microsoft 365/Teams/Active Directory, you\'re building .NET apps, or the client mandates it. Both are production-grade. The difference is ecosystem fit, not reliability.',
    analogy:
      'AWS is like Android — more open, more choices, more configurations. Azure is like working inside the Microsoft Office building — tighter integration, less friction if you\'re already using their products.',
  },
  // ── CI/CD ─────────────────────────────────────────────────────────────────
  {
    id: 'cicd-1',
    icon: RefreshCw,
    title: 'What is CI/CD?',
    category: 'CI/CD',
    difficulty: 'Hard',
    what: 'Continuous Integration + Continuous Deployment — automated testing and shipping of code.',
    why: 'Manual deploys are slow, error-prone, and don\'t scale. CI/CD means merging a PR triggers tests and deploys automatically.',
    when: 'Any project with more than one developer or more than weekly releases.',
    explanation:
      '**CI (Continuous Integration)**: Every push runs automated tests. If tests fail, the branch is blocked from merging. **CD (Continuous Deployment)**: After a merge to main, the pipeline builds the app, runs tests again, and deploys to production — all without human intervention. This means you can ship 50 times a day safely.',
    analogy:
      'CI/CD is like a factory assembly line with quality checks at every station. Bad parts are caught and rejected before the final product ships, instead of discovering defects after delivery.',
  },
  {
    id: 'cicd-2',
    icon: Zap,
    title: 'GitHub Actions',
    category: 'CI/CD',
    difficulty: 'Hard',
    what: 'GitHub\'s built-in CI/CD system — workflows defined in YAML that run on every push or PR.',
    why: 'No separate CI service needed. Lives in your repo, free for public repos and generous free tier for private.',
    when: 'Any project hosted on GitHub that needs automated testing or deployment.',
    explanation:
      'A workflow is triggered by events (push, pull_request, schedule). Jobs run on GitHub\'s cloud runners (or self-hosted). Steps install dependencies, run tests, build artifacts, and deploy. Secrets (API keys, deploy tokens) are stored encrypted in GitHub settings and injected as env vars at runtime.',
    analogy:
      'GitHub Actions is like a robotic assistant that wakes up whenever you push code, runs through a checklist (tests, build, deploy), and reports back with a green tick or red cross.',
    snippet: `# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to server
        env:
          SSH_KEY: \${{ secrets.DEPLOY_SSH_KEY }}
        run: |
          echo "\$SSH_KEY" > key.pem
          chmod 600 key.pem
          rsync -avz -e "ssh -i key.pem" ./dist/ user@server:/app/`,
    snippetLang: 'yaml',
  },
]

const CATEGORIES: Array<'All' | Category> = ['All', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD']

const difficultyColor: Record<Difficulty, string> = {
  Easy: 'text-green bg-green-dim border-green/20',
  Medium: 'text-amber bg-amber-dim border-amber/20',
  Hard: 'text-red bg-red-dim border-red/20',
}

export default function CloudDevOpsPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = activeCategory === 'All'
    ? concepts
    : concepts.filter((c) => c.category === activeCategory)

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Cloud & DevOps"
        subtitle="From containers to cloud — everything you need to deploy real apps."
      />

      {/* Category Filter */}
      <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap gap-2 bg-bg">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo text-white border-indigo'
                : 'bg-surface text-text-muted border-border hover:border-indigo/50 hover:text-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Concepts List */}
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl w-full">
      <div className="flex flex-col gap-3">
        {filtered.map((concept) => {
          const isOpen = expandedId === concept.id
          const Icon = concept.icon
          return (
            <div
              key={concept.id}
              className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-indigo/30"
            >
              {/* Card Header — always visible */}
              <button
                type="button"
                onClick={() => toggle(concept.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-dim flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text">{concept.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${difficultyColor[concept.difficulty]}`}>
                        {concept.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-text-dim uppercase tracking-wide">
                        {concept.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{concept.what}</p>
                  </div>
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-text-dim flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-text-dim flex-shrink-0" />}
              </button>

              {/* Expanded Detail */}
              {isOpen && (
                <div className="px-5 pb-6 border-t border-border">
                  {/* Why / When */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4">
                    <div className="bg-bg rounded-xl border border-border p-3">
                      <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">Why</p>
                      <p className="text-xs text-text-muted leading-relaxed">{concept.why}</p>
                    </div>
                    <div className="bg-bg rounded-xl border border-border p-3">
                      <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">When</p>
                      <p className="text-xs text-text-muted leading-relaxed">{concept.when}</p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-sm text-text-muted leading-relaxed mb-4 whitespace-pre-line">
                    {concept.explanation}
                  </p>

                  {/* Analogy */}
                  <div className="bg-indigo-dim border border-indigo/20 rounded-xl px-4 py-3 mb-4">
                    <p className="text-[10px] font-mono text-indigo-light uppercase tracking-widest mb-1">Analogy</p>
                    <p className="text-xs text-indigo-light leading-relaxed">{concept.analogy}</p>
                  </div>

                  {/* Code Snippet */}
                  {concept.snippet && (
                    <div>
                      <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-2">
                        {concept.snippetLang?.toUpperCase() ?? 'CODE'}
                      </p>
                      <pre className="bg-bg border border-border rounded-xl p-4 text-sm font-mono overflow-x-auto text-text-muted leading-relaxed">
                        <code>{concept.snippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
