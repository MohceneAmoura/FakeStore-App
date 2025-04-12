// src/components/ProductCard.js
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/globals.css'

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <div className="image-container">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2" style={{ height: '3em', overflow: 'hidden' }}>
          {product.title}
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg">${product.price}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <span style={{ color: '#f59e0b', marginRight: '0.25rem' }}>★</span>
          <span>{product.rating.rate} ({product.rating.count} reviews)</span>
        </div>
        <Link
          href={`/product/${product.id}`}
          className="btn btn-primary block w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}