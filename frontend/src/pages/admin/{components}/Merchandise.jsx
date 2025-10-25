import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const Merchandise = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Mock merchandise data
  const [merchandise] = useState([
    {
      id: 1,
      name: 'CEO Bazaar T-Shirt',
      category: 'Apparel',
      price: 50000,
      stock: 45,
      image: null,
      description: 'Premium cotton t-shirt with gold logo',
      status: 'active'
    },
    {
      id: 2,
      name: 'VIP Lanyard',
      category: 'Accessories',
      price: 15000,
      stock: 120,
      image: null,
      description: 'Exclusive VIP event lanyard',
      status: 'active'
    },
    {
      id: 3,
      name: 'Event Poster (A2)',
      category: 'Prints',
      price: 25000,
      stock: 30,
      image: null,
      description: 'Limited edition event poster',
      status: 'active'
    },
    {
      id: 4,
      name: 'Branded Water Bottle',
      category: 'Accessories',
      price: 35000,
      stock: 0,
      image: null,
      description: 'Stainless steel water bottle',
      status: 'out_of_stock'
    }
  ])

  const categories = ['All', 'Apparel', 'Accessories', 'Prints', 'Other']

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-clash font-bold text-3xl mb-2">Merchandise</h1>
          <p className="text-graytext">Manage your products and inventory</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <p className="text-graytext text-sm mb-1">Total Products</p>
          <p className="font-clash font-bold text-3xl text-white">24</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <p className="text-graytext text-sm mb-1">In Stock</p>
          <p className="font-clash font-bold text-3xl text-green-400">18</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <p className="text-graytext text-sm mb-1">Low Stock</p>
          <p className="font-clash font-bold text-3xl text-yellow-400">4</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <p className="text-graytext text-sm mb-1">Total Value</p>
          <p className="font-clash font-bold text-3xl text-gold">UGX 2.4M</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-graytext" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()} className="bg-matte">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merchandise.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-gold/50 transition-colors group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-white/10 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <PhotoIcon className="h-16 w-16 text-graytext" />
              )}
              {item.status === 'out_of_stock' && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-clash font-bold text-lg text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gold">{item.category}</p>
                </div>
              </div>

              <p className="text-sm text-graytext mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-graytext">Price</p>
                  <p className="font-bold text-white">{formatPrice(item.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-graytext">Stock</p>
                  <p className={`font-bold ${item.stock > 10 ? 'text-green-400' : item.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.stock} units
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-md transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-matte border border-white/10 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-clash font-bold text-2xl mb-6">Add New Product</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="T-Shirt, Mug, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors">
                    <option value="apparel" className="bg-matte">Apparel</option>
                    <option value="accessories" className="bg-matte">Accessories</option>
                    <option value="prints" className="bg-matte">Prints</option>
                    <option value="other" className="bg-matte">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (UGX)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                  <PhotoIcon className="h-12 w-12 text-graytext mx-auto mb-2" />
                  <p className="text-sm text-graytext mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-graytext">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Merchandise
