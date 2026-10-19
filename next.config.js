/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Screenshots are pre-optimised WebP files in /public/work, so the image optimiser is not needed.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/work/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}
