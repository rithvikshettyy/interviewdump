export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type QuestionType = 
  'interview' | 'dsa' | 'aptitude' | 'sql' | 'corecs' | 'scenario'
export type JobType = 
  'Internship' | 'Full-time' | 'Remote' | 'Contract'
export type ExperienceLevel = 
  'Beginner' | 'Intermediate' | 'Expert'

export interface Question {
  id: string
  number: number
  question: string
  summary: string
  difficulty: Difficulty
  companies: string[]
  roles: string[]
  type: QuestionType
  topic?: string
  language?: string
  whatTheyTest: string
  explanation: string
  codeExample?: string
  codeLanguage?: string
  strongAnswerPoints: string[]
  whatToAvoid: string
  ytQuery: string
  quickAnswer?: string
  realWorldExample?: string
  relatedTopics?: string[]
  eli10?: string
  tableVisualization?: {
    before?: { headers: string[]; rows: string[][] }
    after?: { headers: string[]; rows: string[][] }
    description?: string
  }
}

export interface Company {
  slug: string
  name: string
  sector: 'Product' | 'Service' | 'Startup' | 'MNC' | 'FAANG'
  tier: 'FAANG' | 'Unicorn' | 'MNC' | 'Startup' | 'Service'
  logo?: string
  focusAreas: string[]
  interviewDifficulty: Difficulty
  questionCount: number
  description: string
}

export interface Concept {
  id: string
  emoji: string
  title: string
  language: string
  tag: string
  difficulty: Difficulty
  teaser: string
  readTime: string
  whatIsIt: string
  analogy: string
  codeExample: string
  codeLanguage: string
  underTheHood: string
  interviewQuestion: string
  strongAnswerPoints: string[]
  commonMistake: string
  correctMentalModel: string
  miniTask: string
  ytQuery: string
  diagramDescription?: string
  whenNotToUse?: string
  systemDesignConnection?: string
  memoryTrick?: string
  prerequisites?: string[]
  eli10?: string
}

export interface OOPSConcept {
  id: string
  emoji: string
  title: string
  difficulty: Difficulty
  teaser: string
  readTime: string
  explanation: string
  realWorldAnalogy: string
  codeExamples: {
    language: string
    code: string
  }[]
  interviewQuestion: string
  strongAnswerPoints: string[]
  commonMistake: string
  miniTask: string
  ytQuery: string
}

export interface QuizQuestion {
  id: string
  concept: string
  difficulty: Difficulty
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  trick?: string
}

export interface AptitudeQuestion {
  id: string
  category: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  trick?: string
  difficulty: Difficulty
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  goal: string
  referral: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
  comingSoon?: boolean
}
