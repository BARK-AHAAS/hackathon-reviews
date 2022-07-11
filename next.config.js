/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["0a89ca5909d70a641cb3-97908b1957474fc40611ec7a2f9bc012.ssl.cf1.rackcdn.com", "cdn.shopify.com", "3461e78f45486f623e96-1814a558f814d55c3cc4882ef49c3c07.ssl.cf1.rackcdn.com", "d2pa97dl1lg52b.cloudfront.net"],
  },
}

module.exports = nextConfig
