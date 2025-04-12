// src/app/product/[id]/page.js
// src/app/product/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!response.ok) throw new Error('Produit non trouvé')
        const data = await response.json()
        setProduct(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, { 
        method: 'DELETE' 
      })
      
      if (!response.ok) throw new Error('Échec de la suppression')
      
      alert('Produit supprimé avec succès')
      router.push('/products')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Échec de la suppression: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p className="mb-4">{error}</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  // Format price to 2 decimal places
  const formattedPrice = parseFloat(product.price).toFixed(2)

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 mt-12">
      <div className="mb-6">
        <Link 
          href="/products" 
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour aux produits
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
            <div className="relative h-80 w-80">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{product.rating.rate} ({product.rating.count} avis)</span>
            </div>
            
            <div className="text-3xl font-bold text-blue-600 mb-6">${formattedPrice}</div>
            
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-grow bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Ajouter au panier
              </button>
            </div>
            
            {isAdmin() && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => router.push(`/dashboard?id=${product.id}`)}
                  className="flex-grow bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-grow bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}