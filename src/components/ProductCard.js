// src/components/ProductCard.js
// src/components/ProductCard.js
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  // Format price to 2 decimal places
  const formattedPrice = parseFloat(product.price).toFixed(2)
  
  // Truncate the title if it's too long
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="flex-grow">
        <div className="relative h-56 bg-gray-50 p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.title}
              width={180}
              height={180}
              className={`object-contain transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {product.category}
          </span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors" 
            title={product.title}>
            {truncateText(product.title, 50)}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-sm">{product.rating.rate} ({product.rating.count} avis)</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-xl">${formattedPrice}</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/product/${product.id}`}
              className="flex-grow bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Voir détail
            </Link>
            
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit()
                  }}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete()
                  }}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}