import { Head, Html, Main, NextScript } from 'next/document'

/**
 * Runs before first paint and decides whether the hero uses the WebGL scene, so layout never shifts.
 * 3D needs WebGL, no reduced-motion preference, and a device not flagged low-power / data-saver.
 * `?view=static` forces the CSS hero (handy for testing). Nothing is persisted.
 */
const EXPERIENCE_SCRIPT = `(function(){var d=document.documentElement;try{
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var gl=false;try{var c=document.createElement('canvas');gl=!!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){}
var n=navigator,cn=n.connection||{};
var low=(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2)||cn.saveData===true;
var q=new URLSearchParams(location.search).get('view');
var ok=gl&&!rm&&!low&&q!=='static';
d.dataset.expWhy=rm?'reduced-motion':!gl?'no-webgl':low?'low-power':'';
d.dataset.exp=ok?'3d':'static';
}catch(e){d.dataset.exp='static'}})();`

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: EXPERIENCE_SCRIPT }} />
        <meta name="theme-color" content="#08090b" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
