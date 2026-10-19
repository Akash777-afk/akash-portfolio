import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'ghost' | 'link'

interface Common {
  variant?: Variant
  size?: 'md' | 'lg'
  /** Trailing arrow. External links get the ↗ glyph automatically. */
  arrow?: boolean
  children: ReactNode
  className?: string
}

type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }

export type ButtonProps = AsButton | AsLink

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ExternalGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Whether an href leaves the site (protocol links such as mailto:/tel: are not "new tab" links). */
export const isExternalHttp = (href: string) => /^https?:\/\//i.test(href)

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', arrow, children, className } = props
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props as AsLink
    if (isExternalHttp(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
          <span>{children}</span>
          <ExternalGlyph className={styles.arrow} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )
    }
    if (/^(mailto:|tel:)/i.test(href) || /\.(pdf)$/i.test(href)) {
      return (
        <a href={href} className={cls} {...rest}>
          <span>{children}</span>
          {arrow && <Arrow />}
        </a>
      )
    }
    return (
      <Link href={href}>
        <a className={cls} {...rest}>
          <span>{children}</span>
          {arrow && <Arrow />}
        </a>
      </Link>
    )
  }

  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, type = 'button', ...rest } = props as AsButton
  return (
    <button type={type} className={cls} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
}
