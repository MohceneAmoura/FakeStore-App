// src/app/dashboard/page.js
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    category: 'electronics',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/')
      return
    }

    if (id) {
      const fetchProduct = async () => {
        setLoading(true)
        try {
          const response = await fetch(`https://fakestoreapi.com/products/${id}`)
          if (!response.ok) throw new Error('Failed to fetch product')
          const data = await response.json()
          setProduct({
            title: data.title,
            price: data.price.toString(),
            description: data.description,
            category: data.category,
            image: data.image
          })
          setLoading(false)
        } catch (err) {
          setError(err.message)
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id, isAdmin, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const url = id 
        ? `https://fakestoreapi.com/products/${id}`
        : 'https://fakestoreapi.com/products'
      
      const method = id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price)
        })
      })
      
      if (!response.ok) throw new Error(id ? 'Failed to update product' : 'Failed to create product')
      
      router.push('/products')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const categories = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing"
  ]

  if (!isAdmin()) return null

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Processing...' : (id ? 'Update Product' : 'Add Product')}
          </button>
        </form>
      </div>
    </div>
  )
}