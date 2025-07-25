import { foodsSlice } from '@/redux/foodslice'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
export default foodsSlice.reducer
