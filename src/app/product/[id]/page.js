// src/app/product/[id]/page.js
// src/app/product/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

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
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Échec de la suppression')
      router.push('/products')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Échec de la suppression')
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image src={product.image} alt={product.title} width={400} height={400} className="rounded-lg" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl font-bold mb-6">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>
          {isAdmin() && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => router.push(`/dashboard?id=${product.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}