import Head from 'next/head'
import { Button } from '../components/ui/Button'
import styles from './404.module.css'

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <Head>
        <title>Page not found — Akash Ganapathy</title>
      </Head>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page isn’t in the stack.</h1>
      <p className={styles.body}>The page you’re looking for doesn’t exist or has moved.</p>
      <Button href="/" arrow>
        Back to the portfolio
      </Button>
    </section>
  )
}
