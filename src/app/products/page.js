// src/app/products/page.js
// src/app/products/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ProductCard from '@/components/ProductCard'
import SearchAndFilter from '@/components/SearchAndFilter'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories')
        ])
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData)
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (searchTerm, category) => {
    let filtered = [...products]
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }
    setFilteredProducts(filtered)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, { 
        method: 'DELETE' 
      })
      if (!response.ok) throw new Error('Échec de la suppression')
      
      // Mise à jour de l'interface après suppression
      const updatedProducts = products.filter(product => product.id !== id)
      setProducts(updatedProducts)
      setFilteredProducts(filteredProducts.filter(product => product.id !== id))
      
      alert('Produit supprimé avec succès')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Échec de la suppression')
    }
  }

  const handleEdit = (id) => {
    router.push(`/dashboard?id=${id}`)
  }

  const handleReset = () => {
    setFilteredProducts(products)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Nos Produits</h1>
        {isAdmin() && (
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter un produit
          </button>
        )}
      </div>
      
      <SearchAndFilter categories={categories} onSearch={handleSearch} onReset={handleReset} />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={isAdmin()} 
              onEdit={() => handleEdit(product.id)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}