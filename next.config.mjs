/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/karyawan/dashboard",
        destination: "/karyawan",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
