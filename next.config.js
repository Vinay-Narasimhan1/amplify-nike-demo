/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",      // replaces 'next export'
  trailingSlash: true,   // makes /shop/ style paths (good for static hosting)
  images: { unoptimized: true } // safety if you use <Image> later
};
module.exports = nextConfig;
