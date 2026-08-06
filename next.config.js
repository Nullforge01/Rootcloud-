/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Serve the plain HTML/CSS/JS dashboard (public/index.html) at "/"
      { source: '/', destination: '/index.html' },
    ];
  },
};

module.exports = nextConfig;
