'use client'

import React, { createContext, useContext, useId } from 'react'
import { motion, AnimatePresence, MotionConfig, type Transition } from 'motion/react'

interface MorphingPopoverCtx {
  open: boolean
  onOpenChange: (v: boolean) => void
  containerId: string
}

const Ctx = createContext<MorphingPopoverCtx | null>(null)

function useCtx() {
  const c = useContext(Ctx)
  if (!c) throw new Error('MorphingPopover sub-component used outside <MorphingPopover>')
  return c
}

interface MorphingPopoverProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (v: boolean) => void
  transition?: Transition
}

export function MorphingPopover({ children, open, onOpenChange, transition }: MorphingPopoverProps) {
  const id = useId()
  return (
    <Ctx.Provider value={{ open, onOpenChange, containerId: `mp-${id}` }}>
      <MotionConfig transition={transition ?? { type: 'spring', bounce: 0.05, duration: 0.3 }}>
        <div className="relative">
          {children}
        </div>
      </MotionConfig>
    </Ctx.Provider>
  )
}

interface TriggerProps {
  children: React.ReactNode
  className?: string
}

export function MorphingPopoverTrigger({ children, className }: TriggerProps) {
  const { open, onOpenChange, containerId } = useCtx()
  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          key="trigger"
          layoutId={containerId}
          className={className}
          onClick={() => onOpenChange(true)}
          style={{ borderRadius: 8, cursor: 'pointer' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ContentProps {
  children: React.ReactNode
  className?: string
  placement?: 'inline' | 'top'
}

export function MorphingPopoverContent({ children, className, placement = 'inline' }: ContentProps) {
  const { open, containerId } = useCtx()

  const positionStyle =
    placement === 'top'
      ? { borderRadius: 12, position: 'absolute' as const, bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50 }
      : { borderRadius: 12 }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="content"
          layoutId={containerId}
          className={className}
          style={positionStyle}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
