// src/app/page.js
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to FakeStore</h1>
      <p className="text-xl mb-8">Explore our amazing products collection</p>
      <Link 
        href="/products" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Browse Products
      </Link>
    </div>
  )
}