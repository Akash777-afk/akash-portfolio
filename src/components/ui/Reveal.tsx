import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/** Fade-and-rise when scrolled into view. Under reduced motion Motion keeps only the opacity change. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}
