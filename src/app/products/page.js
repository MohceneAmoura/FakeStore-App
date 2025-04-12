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

  const handleReset = () => {
    setFilteredProducts(products)
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nos Produits</h1>
        {isAdmin() && (
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter un produit
          </button>
        )}
      </div>
      <SearchAndFilter categories={categories} onSearch={handleSearch} onReset={handleReset} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center py-10">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  )
}