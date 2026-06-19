// ─── Types ────────────────────────────────────────────────────────────────────

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot'
export type NodeState = 'default' | 'visiting' | 'visited' | 'current' | 'found'
export type StackItemState = 'default' | 'entering' | 'leaving'
export type QueueItemState = 'default' | 'enqueuing' | 'dequeuing'

export interface Bar { value: number; state: BarState }
export interface SortStep { bars: Bar[]; description: string; comparisons: number; swaps: number }

export interface SearchStep {
  array: number[]
  low: number
  mid: number
  high: number
  target: number
  found: boolean
  eliminated: number[]
  description: string
}

export interface StackItem { value: number | string; state: StackItemState }
export interface StackStep { items: StackItem[]; operation: string; description: string }

export interface QueueItem { value: number | string; state: QueueItemState }
export interface QueueStep { items: QueueItem[]; operation: string; description: string }

export interface TreeNode { id: string; value: number; state: NodeState; x: number; y: number }
export interface TreeEdge { from: string; to: string }
export interface TreeStep { nodes: TreeNode[]; edges: TreeEdge[]; description: string; visited: string[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cloneBars(bars: Bar[]): Bar[] {
  return bars.map((b) => ({ ...b }))
}

// ─── Bubble Sort ──────────────────────────────────────────────────────────────

export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = input.map((v) => ({ value: v, state: 'default' as BarState }))
  let comparisons = 0
  let swaps = 0
  const n = arr.length

  steps.push({ bars: cloneBars(arr), description: 'Starting Bubble Sort. We compare adjacent elements and bubble the largest to the end.', comparisons, swaps })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      arr[j].state = 'comparing'
      arr[j + 1].state = 'comparing'
      comparisons++
      steps.push({ bars: cloneBars(arr), description: `Comparing ${arr[j].value} and ${arr[j + 1].value}`, comparisons, swaps })

      if (arr[j].value > arr[j + 1].value) {
        arr[j].state = 'swapping'
        arr[j + 1].state = 'swapping'
        steps.push({ bars: cloneBars(arr), description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`, comparisons, swaps })
        // Swap
        const tmp = arr[j].value
        arr[j].value = arr[j + 1].value
        arr[j + 1].value = tmp
        swaps++
      }

      arr[j].state = 'default'
      arr[j + 1].state = 'default'
    }
    arr[n - 1 - i].state = 'sorted'
    steps.push({ bars: cloneBars(arr), description: `Pass ${i + 1} complete. Element ${arr[n - 1 - i].value} is now in its sorted position.`, comparisons, swaps })
  }
  arr[0].state = 'sorted'
  steps.push({ bars: cloneBars(arr), description: 'Array is fully sorted!', comparisons, swaps })

  return steps
}

// ─── Selection Sort ───────────────────────────────────────────────────────────

export function generateSelectionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = input.map((v) => ({ value: v, state: 'default' as BarState }))
  let comparisons = 0
  let swaps = 0
  const n = arr.length

  steps.push({ bars: cloneBars(arr), description: 'Starting Selection Sort. Find the minimum element and move it to the sorted region.', comparisons, swaps })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    arr[i].state = 'pivot' // pivot = current minimum candidate

    for (let j = i + 1; j < n; j++) {
      arr[j].state = 'comparing'
      comparisons++
      steps.push({ bars: cloneBars(arr), description: `Comparing current min (${arr[minIdx].value}) with ${arr[j].value}`, comparisons, swaps })

      if (arr[j].value < arr[minIdx].value) {
        if (minIdx !== i) arr[minIdx].state = 'default'
        minIdx = j
        arr[minIdx].state = 'pivot'
      } else {
        arr[j].state = 'default'
      }
    }

    if (minIdx !== i) {
      arr[i].state = 'swapping'
      arr[minIdx].state = 'swapping'
      const tmp = arr[i].value
      arr[i].value = arr[minIdx].value
      arr[minIdx].value = tmp
      swaps++
      steps.push({ bars: cloneBars(arr), description: `Swapping minimum (${arr[i].value}) to position ${i}`, comparisons, swaps })
    }

    arr[i].state = 'sorted'
    if (minIdx !== i) arr[minIdx].state = 'default'
    steps.push({ bars: cloneBars(arr), description: `Position ${i} sorted with value ${arr[i].value}`, comparisons, swaps })
  }
  arr[n - 1].state = 'sorted'
  steps.push({ bars: cloneBars(arr), description: 'Array is fully sorted!', comparisons, swaps })

  return steps
}

// ─── Binary Search ────────────────────────────────────────────────────────────

export function generateBinarySearchSteps(sorted: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = []
  let low = 0
  let high = sorted.length - 1
  const eliminated: number[] = []

  steps.push({ array: [...sorted], low, mid: Math.floor((low + high) / 2), high, target, found: false, eliminated: [...eliminated], description: `Searching for ${target} in sorted array of ${sorted.length} elements.` })

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    steps.push({ array: [...sorted], low, mid, high, target, found: false, eliminated: [...eliminated], description: `mid = (${low} + ${high}) / 2 = ${mid}. Checking value ${sorted[mid]}.` })

    if (sorted[mid] === target) {
      steps.push({ array: [...sorted], low, mid, high, target, found: true, eliminated: [...eliminated], description: `Found ${target} at index ${mid}!` })
      return steps
    } else if (sorted[mid] < target) {
      for (let i = low; i <= mid; i++) if (!eliminated.includes(i)) eliminated.push(i)
      steps.push({ array: [...sorted], low: mid + 1, mid, high, target, found: false, eliminated: [...eliminated], description: `${sorted[mid]} < ${target}. Eliminating left half. Search continues in [${mid + 1}, ${high}].` })
      low = mid + 1
    } else {
      for (let i = mid; i <= high; i++) if (!eliminated.includes(i)) eliminated.push(i)
      steps.push({ array: [...sorted], low, mid, high: mid - 1, target, found: false, eliminated: [...eliminated], description: `${sorted[mid]} > ${target}. Eliminating right half. Search continues in [${low}, ${mid - 1}].` })
      high = mid - 1
    }
  }

  steps.push({ array: [...sorted], low, mid: -1, high, target, found: false, eliminated: [...eliminated], description: `${target} is not in the array.` })
  return steps
}

// ─── Stack Operations ─────────────────────────────────────────────────────────

export function generateStackSteps(): StackStep[] {
  const steps: StackStep[] = []
  let stack: StackItem[] = []

  const ops: Array<{ type: 'push' | 'pop'; value?: number }> = [
    { type: 'push', value: 10 },
    { type: 'push', value: 20 },
    { type: 'push', value: 30 },
    { type: 'pop' },
    { type: 'push', value: 40 },
    { type: 'pop' },
    { type: 'pop' },
  ]

  steps.push({ items: [], operation: 'Start', description: 'Empty stack. Stack is LIFO — Last In, First Out.' })

  for (const op of ops) {
    if (op.type === 'push') {
      const newItem: StackItem = { value: op.value!, state: 'entering' }
      stack = [...stack, newItem]
      steps.push({ items: [...stack], operation: `PUSH ${op.value}`, description: `Push ${op.value} onto the top of the stack.` })
      stack[stack.length - 1].state = 'default'
      steps.push({ items: [...stack], operation: `PUSH ${op.value}`, description: `${op.value} is now on top of the stack.` })
    } else {
      if (stack.length === 0) continue
      const popped = stack[stack.length - 1].value
      stack = [...stack.slice(0, -1).map((i) => ({ ...i })), { value: popped, state: 'leaving' }]
      steps.push({ items: [...stack], operation: `POP`, description: `Popping ${popped} from top of stack.` })
      stack = stack.slice(0, -1)
      steps.push({ items: [...stack], operation: `POP`, description: `${popped} removed. New top: ${stack.length > 0 ? stack[stack.length - 1].value : 'empty'}.` })
    }
  }

  return steps
}

// ─── Queue Operations ─────────────────────────────────────────────────────────

export function generateQueueSteps(): QueueStep[] {
  const steps: QueueStep[] = []
  let queue: QueueItem[] = []

  const ops: Array<{ type: 'enqueue' | 'dequeue'; value?: number }> = [
    { type: 'enqueue', value: 'A' as any },
    { type: 'enqueue', value: 'B' as any },
    { type: 'enqueue', value: 'C' as any },
    { type: 'dequeue' },
    { type: 'enqueue', value: 'D' as any },
    { type: 'dequeue' },
  ]

  steps.push({ items: [], operation: 'Start', description: 'Empty queue. Queue is FIFO — First In, First Out.' })

  for (const op of ops) {
    if (op.type === 'enqueue') {
      const val = op.value!
      queue = [...queue, { value: val, state: 'enqueuing' }]
      steps.push({ items: [...queue], operation: `ENQUEUE ${val}`, description: `Enqueue ${val} at the rear of the queue.` })
      queue[queue.length - 1].state = 'default'
      steps.push({ items: [...queue], operation: `ENQUEUE ${val}`, description: `${val} is now waiting at the back.` })
    } else {
      if (queue.length === 0) continue
      const dequeued = queue[0].value
      queue = [{ value: dequeued, state: 'dequeuing' }, ...queue.slice(1).map((i) => ({ ...i }))]
      steps.push({ items: [...queue], operation: 'DEQUEUE', description: `Dequeue ${dequeued} from the front of the queue.` })
      queue = queue.slice(1)
      steps.push({ items: [...queue], operation: 'DEQUEUE', description: `${dequeued} served. Next in line: ${queue.length > 0 ? queue[0].value : 'none'}.` })
    }
  }

  return steps
}

// ─── Tree BFS / DFS ───────────────────────────────────────────────────────────

// Simple binary tree layout
const TREE_NODES: TreeNode[] = [
  { id: 'n1', value: 8,  state: 'default', x: 50,   y: 10 },
  { id: 'n2', value: 3,  state: 'default', x: 25,   y: 28 },
  { id: 'n3', value: 10, state: 'default', x: 75,   y: 28 },
  { id: 'n4', value: 1,  state: 'default', x: 12.5, y: 50 },
  { id: 'n5', value: 6,  state: 'default', x: 37.5, y: 50 },
  { id: 'n6', value: 14, state: 'default', x: 87.5, y: 50 },
  { id: 'n7', value: 4,  state: 'default', x: 30,   y: 72 },
  { id: 'n8', value: 7,  state: 'default', x: 45,   y: 72 },
]

const TREE_EDGES: TreeEdge[] = [
  { from: 'n1', to: 'n2' }, { from: 'n1', to: 'n3' },
  { from: 'n2', to: 'n4' }, { from: 'n2', to: 'n5' },
  { from: 'n3', to: 'n6' },
  { from: 'n5', to: 'n7' }, { from: 'n5', to: 'n8' },
]

function cloneNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({ ...n }))
}

export function generateBFSSteps(): TreeStep[] {
  const steps: TreeStep[] = []
  const nodes = cloneNodes(TREE_NODES)
  const visited: string[] = []

  steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: 'BFS: Start at the root. Use a queue to explore level by level.', visited: [] })

  const queue = ['n1']
  const visitedSet = new Set<string>()

  while (queue.length > 0) {
    const id = queue.shift()!
    if (visitedSet.has(id)) continue

    // Mark visiting
    const node = nodes.find((n) => n.id === id)!
    node.state = 'visiting'
    steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `Visiting node ${node.value}. Queue: [${queue.join(', ') || 'empty'}]`, visited: [...visited] })

    node.state = 'visited'
    visitedSet.add(id)
    visited.push(id)
    steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `Marked node ${node.value} as visited. Adding children to queue.`, visited: [...visited] })

    const children = TREE_EDGES.filter((e) => e.from === id).map((e) => e.to)
    for (const c of children) {
      if (!visitedSet.has(c)) queue.push(c)
    }
  }

  steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `BFS complete! Visit order: ${visited.map((id) => nodes.find((n) => n.id === id)?.value).join(' → ')}`, visited: [...visited] })
  return steps
}

export function generateDFSSteps(): TreeStep[] {
  const steps: TreeStep[] = []
  const nodes = cloneNodes(TREE_NODES)
  const visited: string[] = []
  const visitedSet = new Set<string>()

  steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: 'DFS: Start at root. Go as deep as possible before backtracking.', visited: [] })

  function dfs(id: string) {
    if (visitedSet.has(id)) return
    const node = nodes.find((n) => n.id === id)!
    node.state = 'visiting'
    steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `Visiting node ${node.value} (pre-order).`, visited: [...visited] })

    node.state = 'visited'
    visitedSet.add(id)
    visited.push(id)

    const children = TREE_EDGES.filter((e) => e.from === id).map((e) => e.to)
    for (const c of children) dfs(c)

    steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `Backtracking from node ${node.value}.`, visited: [...visited] })
  }

  dfs('n1')
  steps.push({ nodes: cloneNodes(nodes), edges: TREE_EDGES, description: `DFS complete! Visit order: ${visited.map((id) => nodes.find((n) => n.id === id)?.value).join(' → ')}`, visited: [...visited] })
  return steps
}
