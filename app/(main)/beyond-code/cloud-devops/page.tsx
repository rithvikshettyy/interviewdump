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
  HardDrive,
  Shield,
  Globe,
  Database,
  Activity,
  Code2,
  Lock,
  Cpu,
  BarChart2,
} from 'lucide-react'

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Category = 'Docker' | 'Kubernetes' | 'AWS' | 'Azure' | 'CI/CD' | 'Linux' | 'Terraform' | 'Monitoring'

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
  // ── Linux ─────────────────────────────────────────────────────────────────
  {
    id: 'linux-1',
    icon: Terminal,
    title: 'Linux Command Line Essentials',
    category: 'Linux',
    difficulty: 'Easy',
    what: 'The core commands every backend developer and DevOps engineer needs daily.',
    why: 'Every server, container, and CI runner runs Linux. You will SSH into servers, debug logs, and write shell scripts.',
    when: 'Deploying apps, debugging production issues, writing CI/CD scripts, working inside Docker containers.',
    explanation:
      'Navigation: pwd (where am I?), ls -la (list all files with permissions), cd (change directory), find (search files).\n\nFile operations: cp, mv, rm -rf, mkdir -p, touch (create empty file), cat / less / tail -f (read files, follow logs).\n\nPermissions: chmod 755 (rwxr-xr-x), chown user:group file. Understand read(4)/write(2)/execute(1) for owner/group/others.\n\nProcesses: ps aux (list all processes), top / htop (live monitor), kill -9 PID (force kill), & (run in background), nohup (keep running after logout).\n\nNetworking: curl, wget (HTTP requests), netstat -tlnp / ss -tlnp (open ports), ping, ssh, scp (copy files over SSH).\n\nText tools: grep -r "pattern" . (search content), awk, sed, wc -l (line count), sort, uniq, xargs.\n\nPiping: command1 | command2 — output of first becomes input of second. | grep | sort | uniq -c chains are powerful.',
    analogy:
      'The Linux command line is like knowing how to speak the native language of every server on the internet. GUIs are translation apps — useful but slow, limited, and not available everywhere.',
    snippet: `# Navigation
pwd && ls -la           # where am I + list with hidden files
find . -name "*.log"   # find all .log files recursively
find . -mtime -1       # files modified in last 24h

# File operations
mkdir -p /app/logs     # create nested dirs
tail -f /var/log/app.log  # follow logs in real-time
grep -rn "ERROR" ./logs/  # search for ERROR in all files

# Process management
ps aux | grep node     # find Node.js processes
lsof -i :3000          # what's using port 3000?
kill -9 $(lsof -t -i:3000)  # kill whatever is on port 3000

# Permissions
chmod +x deploy.sh     # make executable
chown -R appuser:appuser /app  # change ownership recursively

# Disk and memory
df -h                  # disk usage (human readable)
free -h                # memory usage
du -sh ./node_modules  # size of a directory

# SSH and remote
ssh -i key.pem ubuntu@1.2.3.4     # connect to server
scp -i key.pem ./build user@host:/app  # copy files to server

# Useful combos
cat access.log | grep "POST /api" | wc -l    # count POST requests
ps aux --sort=-%mem | head -10               # top 10 memory consumers`,
    snippetLang: 'bash',
  },
  {
    id: 'linux-2',
    icon: Code2,
    title: 'Shell Scripting & Automation',
    category: 'Linux',
    difficulty: 'Medium',
    what: 'Write bash scripts to automate repetitive tasks: deploys, backups, health checks.',
    why: 'Manual steps in a deploy are error-prone and slow. A script runs the same steps every time, instantly.',
    when: 'Deployment automation, backup cron jobs, environment setup scripts, CI/CD step scripts.',
    explanation:
      'A shell script is a text file starting with #!/bin/bash (the shebang line) that contains shell commands. Make it executable with chmod +x script.sh and run it with ./script.sh.\n\nVariables: NAME="Rithvik", echo "$NAME". No spaces around the = sign.\n\nConditionals: if [ condition ]; then ... fi. Common conditions: -f file (file exists), -d dir (directory exists), -z "$var" (variable is empty), $? -eq 0 (last command succeeded).\n\nLoops: for item in list; do ... done. while [ condition ]; do ... done.\n\nFunctions: function name() { ... }. Call with name arg1 arg2.\n\nError handling: set -e (exit on any error), set -u (error on unset variables), set -o pipefail (catch pipe errors). Add these at the top of every serious script.',
    analogy:
      'A shell script is a recipe written down once. Instead of a chef memorising and re-executing 20 steps from memory each time (with risk of forgetting step 7), they follow the recipe — same result every time.',
    snippet: `#!/bin/bash
set -euo pipefail  # exit on error, unset vars, pipe failures

# Variables
APP_DIR="/app"
BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
LOG_FILE="/var/log/deploy.log"

# Function
log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

# Conditionals
if [ ! -d "$APP_DIR" ]; then
  log "App directory does not exist — aborting"
  exit 1
fi

# Loop
for service in web api worker; do
  log "Restarting $service..."
  systemctl restart "$service" && log "$service restarted OK" || log "$service restart FAILED"
done

# Capture command output
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log "Current branch: $CURRENT_BRANCH"

# Check last command succeeded
npm run build
if [ $? -eq 0 ]; then
  log "Build succeeded"
else
  log "Build FAILED — rolling back"
  git stash
  exit 1
fi`,
    snippetLang: 'bash',
  },
  // ── AWS (expanded) ────────────────────────────────────────────────────────
  {
    id: 'aws-3',
    icon: Server,
    title: 'AWS EC2 — Virtual Servers',
    category: 'AWS',
    difficulty: 'Medium',
    what: 'Elastic Compute Cloud — rent virtual machines in the cloud by the hour.',
    why: 'The foundation of AWS. Understanding EC2 teaches you how cloud computing works at the infrastructure level.',
    when: 'Running persistent workloads: Node.js servers, background workers, databases (though RDS is usually better for databases).',
    explanation:
      'An EC2 instance is a virtual machine running in AWS data centres. You choose the instance type (CPU, memory), operating system (usually Ubuntu or Amazon Linux), storage (EBS volumes), and network (VPC, security groups).\n\nKey concepts:\n\nInstance types: t3.micro (1 vCPU, 1GB RAM — free tier), t3.medium (2 vCPU, 4GB), c5 (compute-optimised), r5 (memory-optimised), g4 (GPU). The t series are burstable — great for variable workloads.\n\nAMI (Amazon Machine Image): the OS snapshot your instance boots from. AWS provides Ubuntu, Amazon Linux, Windows. You can create custom AMIs for fast auto-scaling.\n\nSecurity Groups: stateful firewall rules. Define which inbound ports are open (e.g., 22 for SSH, 443 for HTTPS). Outbound is open by default.\n\nElastic IP: a static public IP address. Without it, your instance IP changes each time it restarts.\n\nUser Data: a script that runs on first boot — install packages, pull code, start services.',
    analogy:
      'EC2 is renting a physical computer from AWS. You decide the specs (instance type), install your OS (AMI), set up a firewall (security group), and run whatever you want on it.',
    snippet: `# Launch an instance with AWS CLI
aws ec2 run-instances \\
  --image-id ami-0c55b159cbfafe1f0 \\   # Ubuntu 22.04 LTS
  --instance-type t3.micro \\
  --key-name my-keypair \\               # SSH key pair
  --security-group-ids sg-0abc123 \\
  --subnet-id subnet-0xyz456 \\
  --user-data file://setup.sh \\         # runs on first boot
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-server}]'

# setup.sh — user data script (runs as root on first boot)
#!/bin/bash
apt-get update -y
apt-get install -y nodejs npm nginx
git clone https://github.com/myorg/myapp.git /app
cd /app && npm ci && npm run build
pm2 start dist/server.js --name app
pm2 startup && pm2 save

# Connect via SSH
ssh -i my-keypair.pem ubuntu@<public-ip>

# Allocate and associate Elastic IP (static IP)
aws ec2 allocate-address --domain vpc
aws ec2 associate-address --instance-id i-abc123 --allocation-id eipalloc-xyz`,
    snippetLang: 'bash',
  },
  {
    id: 'aws-4',
    icon: HardDrive,
    title: 'AWS S3 — Object Storage',
    category: 'AWS',
    difficulty: 'Easy',
    what: 'Simple Storage Service — store any file (images, videos, backups, static sites) at unlimited scale.',
    why: 'S3 is the cheapest, most reliable file storage on the planet. Every AWS app uses it.',
    when: 'User file uploads, static website hosting, application backups, data lake storage, CDN origin.',
    explanation:
      'S3 stores files as "objects" inside "buckets". An object is the file + metadata. A bucket is a container with a globally unique name.\n\nKey features:\n\nStorage classes: S3 Standard (frequent access), S3-IA (infrequent access, cheaper), S3 Glacier (archival, cents per GB/month, slower retrieval). Use lifecycle policies to auto-transition objects between classes.\n\nPresigned URLs: generate a temporary URL that allows anyone to upload or download a specific object without AWS credentials. Critical for client-side file uploads (browser uploads directly to S3, skipping your server).\n\nStatic website hosting: enable static hosting on a bucket to serve an index.html — great for SPAs. Pair with CloudFront for a global CDN.\n\nVersioning: keep all versions of an object. Protects against accidental deletion.\n\nEvent notifications: trigger a Lambda function when a file is uploaded — e.g., resize images or process CSVs automatically.',
    analogy:
      'S3 is an infinitely large filing cabinet in the cloud. You pay only for the drawer space you use, files never corrupt, and the cabinet never fills up.',
    snippet: `// Upload file to S3 from Node.js (AWS SDK v3)
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: 'ap-south-1' })

// Upload a file
await s3.send(new PutObjectCommand({
  Bucket: 'my-app-uploads',
  Key: \`users/\${userId}/avatar.webp\`,
  Body: fileBuffer,
  ContentType: 'image/webp',
}))

// Generate presigned URL for direct browser upload (expires in 5 min)
const presignedUrl = await getSignedUrl(
  s3,
  new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: \`uploads/\${crypto.randomUUID()}.jpg\`,
    ContentType: 'image/jpeg',
  }),
  { expiresIn: 300 }
)
// Return this URL to the client, browser POSTs directly to S3

# AWS CLI — common S3 operations
aws s3 ls s3://my-bucket/               # list objects
aws s3 cp ./dist s3://my-bucket/ --recursive  # upload build
aws s3 sync ./public s3://my-bucket/public/   # sync folder
aws s3 rm s3://my-bucket/old-file.txt         # delete object`,
    snippetLang: 'typescript',
  },
  {
    id: 'aws-5',
    icon: Lock,
    title: 'AWS IAM — Identity & Access Management',
    category: 'AWS',
    difficulty: 'Medium',
    what: 'Control who can do what in your AWS account — users, roles, policies.',
    why: 'IAM is the security foundation of AWS. Misconfigured IAM is the most common cause of AWS security incidents.',
    when: 'Every AWS resource interaction. Granting permissions to EC2 instances, Lambda functions, CI/CD pipelines.',
    explanation:
      'IAM entities:\n\nUsers: human identities with long-term credentials (access key + secret). Best practice: use users only for CI/CD pipelines where role assumption isn\'t possible. Enable MFA for all users.\n\nRoles: temporary credentials assumed by services or humans. EC2 instances, Lambda functions, ECS tasks should all use roles — never hard-code access keys in code or environment variables.\n\nPolicies: JSON documents that define permissions. Attach to users or roles. Each statement has Effect (Allow/Deny), Action (which API calls), Resource (which ARNs).\n\nPrinciple of least privilege: only grant the minimum permissions needed. An S3 reader should not have s3:DeleteObject. A Lambda that only reads from DynamoDB shouldn\'t have iam:CreateUser.\n\nAWS managed policies vs inline policies: managed policies are maintained by AWS and can be attached to multiple identities. Inline policies are embedded in one user/role and deleted with it.',
    analogy:
      'IAM is the badge-access system in an office building. Each badge (role/user) grants access to specific rooms (resources). The security policy document defines which badge opens which door. You never give the master key to a contractor — you create a temporary scoped badge.',
    snippet: `# IAM Policy — allow only reading from a specific S3 bucket
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-app-bucket",
        "arn:aws:s3:::my-app-bucket/*"
      ]
    }
  ]
}

# Create an IAM role for EC2 (instance profile)
aws iam create-role \\
  --role-name EC2AppRole \\
  --assume-role-policy-document file://trust-policy.json

# trust-policy.json — allows EC2 to assume this role
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}

# Attach a policy to the role
aws iam attach-role-policy \\
  --role-name EC2AppRole \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess`,
    snippetLang: 'bash',
  },
  {
    id: 'aws-6',
    icon: Network,
    title: 'AWS Lambda — Serverless Functions',
    category: 'AWS',
    difficulty: 'Medium',
    what: 'Run code without managing servers — pay only for actual execution time, not idle time.',
    why: 'Lambda removes server maintenance, scales automatically, and is extremely cheap for low-to-medium traffic.',
    when: 'Event-driven processing (S3 uploads, DynamoDB streams), API backends, scheduled jobs, webhook handlers.',
    explanation:
      'Lambda runs your function in response to events. You upload code (Node.js, Python, Go, Java, etc.), configure memory (128MB–10GB) and timeout (up to 15 minutes), and Lambda handles everything else.\n\nPricing: first 1 million invocations/month free. Then $0.20 per million. Plus compute time: $0.0000166667 per GB-second. A function using 128MB that runs for 100ms costs $0.000000208 per invocation.\n\nCold starts: the first invocation after a period of inactivity spins up a new execution environment. This can add 100ms–1s of latency. Mitigations: provisioned concurrency (keep instances warm, costs money), use smaller packages, avoid large dependencies.\n\nLimits: max 15 minute timeout, 10GB memory, 512MB–10GB ephemeral storage. Not suitable for: long-running jobs, WebSocket connections that need persistent state, anything requiring a filesystem.\n\nConnect to API Gateway to create a serverless HTTP API. Lambda + API Gateway is a common pattern for small-to-medium REST APIs.',
    analogy:
      'Lambda is like a freelancer. You pay only when they work — no salary when idle. You call them when needed, they complete the task and disappear. For sporadic work this is far cheaper than a full-time employee (a running server).',
    snippet: `// Lambda handler (Node.js)
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body ?? '{}')

  // Your business logic here
  const result = await processOrder(body)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  }
}

# Deploy with AWS CLI
zip -r function.zip dist/ node_modules/
aws lambda update-function-code \\
  --function-name my-function \\
  --zip-file fileb://function.zip

# Invoke for testing
aws lambda invoke \\
  --function-name my-function \\
  --payload '{"body": "{\"orderId\": \"123\"}"}' \\
  output.json && cat output.json

# Scheduled Lambda (like a cron job) via EventBridge
aws events put-rule \\
  --schedule-expression "rate(5 minutes)" \\
  --name cleanup-job`,
    snippetLang: 'typescript',
  },
  {
    id: 'aws-7',
    icon: Globe,
    title: 'AWS CloudFront — CDN',
    category: 'AWS',
    difficulty: 'Easy',
    what: "AWS's global CDN — cache your content at 400+ edge locations worldwide.",
    why: 'Reduces latency for global users, offloads traffic from your origin, required for S3 static site HTTPS.',
    when: 'Static site delivery, caching API responses, distributing media files, terminating SSL.',
    explanation:
      'CloudFront sits in front of your origin (S3 bucket, EC2 instance, ALB, or API Gateway). Users connect to the nearest CloudFront edge location. On cache miss, CloudFront fetches from your origin and caches the response.\n\nDistributions: a CloudFront distribution defines origins, cache behaviours, SSL certificates, and custom domain.\n\nCache behaviours: different rules for different URL paths. /api/* might have TTL=0 (never cache, forward to origin). /static/* might have TTL=31536000 (cache for 1 year).\n\nOrigin Access Control (OAC): blocks direct public access to your S3 bucket — all requests must go through CloudFront. Best practice for S3-hosted sites.\n\nLambda@Edge / CloudFront Functions: run JavaScript at the edge before CloudFront serves the response. Use for: URL rewrites, A/B testing, auth validation, header modification.\n\nInvalidation: when you deploy new assets, invalidate the cache so CloudFront serves fresh content. Fingerprint filenames (app.a1b2c3.js) to avoid this for versioned assets.',
    analogy:
      'CloudFront is like having a local warehouse in every major city. Instead of shipping from one central warehouse in Mumbai to a customer in New York (200ms+), a CloudFront edge delivers from New Jersey (<10ms).',
    snippet: `# Create a CloudFront distribution pointing to an S3 bucket
aws cloudfront create-distribution --distribution-config '{
  "Origins": {
    "Items": [{
      "Id": "S3Origin",
      "DomainName": "my-bucket.s3.amazonaws.com",
      "S3OriginConfig": { "OriginAccessIdentity": "" }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Enabled": true
}'

# Invalidate cache after deploy (clear all paths)
aws cloudfront create-invalidation \\
  --distribution-id E1234567890ABC \\
  --paths "/*"

# Better: use fingerprinted filenames — no invalidation needed
# app.js → app.3f8a9c1b.js (Next.js does this automatically)`,
    snippetLang: 'bash',
  },
  {
    id: 'aws-8',
    icon: Cloud,
    title: 'Deploying Next.js on AWS',
    category: 'AWS',
    difficulty: 'Hard',
    what: 'Three production-ready ways to deploy a Next.js app on AWS.',
    why: 'Understanding deployment options lets you choose between cost, simplicity, and control.',
    when: 'Taking a Next.js app from local to production on AWS infrastructure.',
    explanation:
      'Option 1 — AWS Amplify (simplest): Connect your GitHub repo. Amplify builds and deploys on every push. Handles SSR, ISR, Server Actions via Lambda automatically. Best for: small to medium apps, teams without dedicated DevOps.\n\nOption 2 — EC2 + PM2 (full control): SSH into an EC2 instance, pull code, npm run build, start with PM2 (process manager that restarts on crash). Put Nginx in front as a reverse proxy. Add a GitHub Actions workflow for automated deploys. Best for: teams comfortable with Linux, needing customisation.\n\nOption 3 — Lambda + API Gateway + S3 + CloudFront (serverless): Use the open-next or SST framework to adapt Next.js for Lambda. Static assets go to S3 + CloudFront. SSR handlers run on Lambda. ISR cache on S3. Best for: variable traffic with cold-start tolerance, cost optimisation at scale.\n\nFor most teams: start with Amplify or Vercel. Move to a custom setup when you have specific requirements (custom VPC, existing AWS infrastructure, cost at scale).',
    analogy:
      'Amplify is a furnished apartment — move in immediately. EC2 is an empty flat — wire everything yourself, fully customised. Lambda+CloudFront is modular furniture — assemble the pieces you need, nothing you don\'t.',
    snippet: `# Option 1: AWS Amplify — simplest
# 1. Install Amplify CLI: npm install -g @aws-amplify/cli
# 2. amplify init
# 3. amplify add hosting
# 4. amplify publish
# Or connect GitHub in the Amplify Console — it handles everything

# Option 2: EC2 deployment script
#!/bin/bash
# On your CI (GitHub Actions) or locally
ssh -i key.pem ubuntu@$EC2_IP << 'EOF'
  cd /app
  git pull origin main
  npm ci
  npm run build
  pm2 restart app || pm2 start npm --name app -- start
EOF

# Nginx reverse proxy for Next.js on port 3000
# /etc/nginx/sites-available/app
server {
  listen 80;
  server_name example.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

# Option 3: SST (Serverless Stack) — Next.js on Lambda
# sst.config.ts
export default $config({
  app() { return { name: 'myapp', home: 'aws' } },
  async run() {
    new sst.aws.Nextjs('MyApp')  // handles Lambda + S3 + CloudFront
  },
})`,
    snippetLang: 'bash',
  },
  // ── Terraform ─────────────────────────────────────────────────────────────
  {
    id: 'tf-1',
    icon: Code2,
    title: 'Infrastructure as Code with Terraform',
    category: 'Terraform',
    difficulty: 'Hard',
    what: 'Define your cloud infrastructure in code files — version controlled, repeatable, reviewable.',
    why: 'Manual clicking in the AWS console is slow, error-prone, and not reproducible. Terraform makes infrastructure a first-class engineering artefact.',
    when: 'Provisioning and managing cloud resources: VPCs, EC2 instances, RDS databases, S3 buckets, IAM roles.',
    explanation:
      'Terraform uses HCL (HashiCorp Configuration Language) to describe infrastructure. You write .tf files declaring what resources you want; Terraform figures out how to create, update, or delete them to match.\n\nCore workflow:\n1. terraform init — download provider plugins (AWS, GCP, Azure)\n2. terraform plan — show what will change (like a dry run)\n3. terraform apply — make the changes\n4. terraform destroy — delete all managed resources\n\nState file (terraform.tfstate): Terraform tracks what it has created. Store it remotely (S3 bucket + DynamoDB lock table) for team use — never commit it to Git.\n\nProviders: plugins for each cloud/service. aws provider manages AWS resources. hashicorp/random, hashicorp/tls are utility providers.\n\nModules: reusable Terraform configurations. Use community modules from the Terraform Registry (e.g., terraform-aws-modules/vpc/aws) for common infrastructure patterns.',
    analogy:
      'Terraform is like an architect\'s blueprint. Instead of telling construction workers "build this, then that, then this" step by step, you hand them the final blueprint and they figure out the optimal construction order.',
    snippet: `# main.tf — provision an EC2 instance with S3 bucket

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  # Store state remotely (team-safe)
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" { region = var.aws_region }

# Variables
variable "aws_region" { default = "ap-south-1" }
variable "instance_type" { default = "t3.micro" }

# EC2 instance
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = { Name = "web-server", Environment = "prod" }
}

# S3 bucket with versioning
resource "aws_s3_bucket" "uploads" {
  bucket = "my-app-uploads-\${random_id.suffix.hex}"
}
resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration { status = "Enabled" }
}

# Output values
output "instance_ip" { value = aws_instance.web.public_ip }
output "bucket_name" { value = aws_s3_bucket.uploads.bucket }`,
    snippetLang: 'hcl',
  },
  {
    id: 'tf-2',
    icon: Layers,
    title: 'Terraform Modules & Best Practices',
    category: 'Terraform',
    difficulty: 'Hard',
    what: 'Structure Terraform code for reuse and maintainability at team scale.',
    why: 'Copy-pasting Terraform blocks across environments (dev/staging/prod) creates drift and maintenance pain.',
    when: 'Managing multiple environments, sharing infrastructure patterns across teams, onboarding new engineers.',
    explanation:
      'Modules: a module is a directory of .tf files. Call it from another configuration with a module block and pass input variables. Outputs from the module are returned to the caller.\n\nEnvironment pattern: maintain separate state per environment (dev/staging/prod). Use a modules/ directory for reusable components (vpc, rds, ecs_service) and an environments/ directory that composes them.\n\nWorkspaces: terraform workspace new dev creates a separate state file for each workspace. Simpler than separate directories but harder to manage different configs per environment.\n\nRemote state data source: one Terraform configuration can read outputs from another state file. Useful for sharing VPC IDs, subnet IDs between the networking config and the application config.\n\nKey best practices: always run terraform plan in CI before apply. Use terraform fmt to format consistently. Use tflint for linting. Tag every resource with Environment, Team, ManagedBy=Terraform. Never hardcode account IDs — use data sources.',
    analogy:
      'Terraform modules are like LEGO sets. The vpc module is a standardised base plate. The rds module is a specific piece. You combine them to build different shapes (environments) without designing each piece from scratch.',
    snippet: `# modules/rds/main.tf — reusable RDS module
variable "db_name"     { type = string }
variable "db_password" { type = string; sensitive = true }
variable "subnet_ids"  { type = list(string) }
variable "environment" { type = string }

resource "aws_db_instance" "main" {
  identifier        = "\${var.environment}-\${var.db_name}"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = var.environment == "prod" ? "db.t3.medium" : "db.t3.micro"
  allocated_storage = 20
  db_name           = var.db_name
  username          = "admin"
  password          = var.db_password
  db_subnet_group_name = aws_db_subnet_group.main.name
  skip_final_snapshot  = var.environment != "prod"
  tags = { Environment = var.environment }
}

output "endpoint" { value = aws_db_instance.main.endpoint }

# environments/prod/main.tf — compose modules
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  name    = "prod-vpc"
  cidr    = "10.0.0.0/16"
}

module "database" {
  source      = "../../modules/rds"
  db_name     = "appdb"
  db_password = var.db_password  # from secrets manager or var file
  subnet_ids  = module.vpc.private_subnets
  environment = "prod"
}

output "db_endpoint" { value = module.database.endpoint }`,
    snippetLang: 'hcl',
  },
  // ── Monitoring ────────────────────────────────────────────────────────────
  {
    id: 'monitoring-1',
    icon: BarChart2,
    title: 'AWS CloudWatch',
    category: 'Monitoring',
    difficulty: 'Medium',
    what: "AWS's built-in observability service — metrics, logs, alarms, and dashboards.",
    why: 'Without monitoring, you learn about production issues from angry users. With it, alarms wake you before users notice.',
    when: 'Monitoring EC2, Lambda, RDS, ECS, API Gateway — any AWS service.',
    explanation:
      'CloudWatch collects three types of data:\n\nMetrics: numeric time-series data. CPU utilisation, request count, error rate, memory usage. AWS services publish metrics automatically. You can publish custom metrics from your app code.\n\nLogs: CloudWatch Logs stores log streams from your application. EC2 instances send logs via the CloudWatch Agent. Lambda logs automatically. Use Log Insights for SQL-like queries across log data.\n\nAlarms: trigger notifications or auto-scaling actions when a metric crosses a threshold. Email via SNS, auto-scale EC2 fleet, call a Lambda.\n\nDashboards: visualise multiple metrics in one view. Standard for ops teams.\n\nKey metrics to watch: EC2 CPU > 80% (scale up), Lambda error rate > 1% (alert), RDS connections approaching limit (add read replica), API Gateway 5xx rate > 0.1% (alert).\n\nContainer Insights: enabled on ECS/EKS for per-container CPU/memory metrics.\n\nX-Ray: distributed tracing — trace a request through multiple Lambda functions or microservices.',
    analogy:
      'CloudWatch is the car dashboard. Without it you\'re driving blind — no speedometer, no fuel gauge, no warning lights. It doesn\'t make the car faster but it tells you when something is wrong before you break down.',
    snippet: `// Publish custom metrics from Node.js
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

const cw = new CloudWatchClient({ region: 'ap-south-1' })

async function recordOrderPlaced(orderId: string, amount: number) {
  await cw.send(new PutMetricDataCommand({
    Namespace: 'MyApp/Orders',
    MetricData: [
      {
        MetricName: 'OrderPlaced',
        Value: 1,
        Unit: 'Count',
        Dimensions: [{ Name: 'Environment', Value: 'prod' }],
      },
      {
        MetricName: 'OrderValue',
        Value: amount,
        Unit: 'None',
      },
    ],
  }))
}

# Create a billing alarm via CLI (prevent AWS bill surprises)
aws cloudwatch put-metric-alarm \\
  --alarm-name "BillingAlert-10USD" \\
  --metric-name EstimatedCharges \\
  --namespace AWS/Billing \\
  --statistic Maximum \\
  --period 86400 \\
  --threshold 10 \\
  --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:BillingAlerts

# Query logs with CloudWatch Insights
# fields @timestamp, @message
# | filter @message like /ERROR/
# | sort @timestamp desc
# | limit 50`,
    snippetLang: 'typescript',
  },
  {
    id: 'monitoring-2',
    icon: Activity,
    title: 'Prometheus & Grafana',
    category: 'Monitoring',
    difficulty: 'Hard',
    what: 'Open-source observability stack — Prometheus scrapes metrics, Grafana visualises them.',
    why: 'Cloud-agnostic, free, industry standard for Kubernetes and self-hosted infrastructure.',
    when: 'Kubernetes clusters, self-hosted apps, multi-cloud setups, when you need custom metrics at scale.',
    explanation:
      'Prometheus is a time-series database and metrics scraper. It pulls metrics from targets (your app, Kubernetes nodes, databases) by hitting a /metrics HTTP endpoint. Stores metrics in a local TSDB. Uses PromQL for queries.\n\nYour app exposes metrics on /metrics in the Prometheus exposition format. Libraries exist for every language (prom-client for Node.js).\n\nAlert rules: define PromQL conditions. Prometheus evaluates them on an interval. If firing, it sends alerts to Alertmanager, which routes them to PagerDuty, Slack, email.\n\nGrafana is the visualisation layer. It connects to Prometheus (and 50+ other data sources: CloudWatch, Loki, Elasticsearch, PostgreSQL). You build dashboards with graphs, gauges, tables, and heatmaps. Pre-built dashboards exist for Node.js, Express, Kubernetes, Postgres, Redis — import them from grafana.com/dashboards.\n\nLoki: log aggregation by Grafana Labs, designed to work with Grafana. Like Prometheus but for logs. Cheaper than Elasticsearch for many use cases.\n\nkube-prometheus-stack: Helm chart that installs the full stack (Prometheus, Grafana, Alertmanager, node-exporter, kube-state-metrics) on Kubernetes in one command.',
    analogy:
      'Prometheus is like a doctor that takes your vitals every 15 seconds — heart rate, blood pressure, temperature. Grafana is the monitor displaying those vitals in real time. Alertmanager is the alarm that fires when a vital crosses a dangerous threshold.',
    snippet: `// Instrument a Node.js/Express app with prom-client
import express from 'express'
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client'

const register = new Registry()
collectDefaultMetrics({ register })  // CPU, memory, event loop lag, GC

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
})

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'path'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
})

// Middleware to record metrics
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, path: req.path })
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, path: req.path, status: res.statusCode })
    end()
  })
  next()
})

// Prometheus scrapes this endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

# Docker Compose — full monitoring stack locally
version: '3.9'
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=secret`,
    snippetLang: 'typescript',
  },
]

const CATEGORIES: Array<'All' | Category> = ['All', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Monitoring', 'Azure']

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
