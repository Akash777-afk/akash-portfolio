import { MotionConfig } from 'framer-motion'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Layout } from '../components/layout/Layout'
import { profile } from '../content/profile'
import { ExperienceProvider } from '../lib/experience'
import '../styles/tokens.css'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={profile.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={profile.siteTitle} />
        <meta property="og:description" content={profile.description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <noscript>
        {/* Without JS the scroll-reveal wrappers must not stay invisible. */}
        <style>{`[data-reveal],[data-entry]{opacity:1!important;transform:none!important}[data-wipe]{clip-path:none!important}`}</style>
      </noscript>
      <MotionConfig reducedMotion="user">
        <ExperienceProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ExperienceProvider>
      </MotionConfig>
    </>
  )
}
