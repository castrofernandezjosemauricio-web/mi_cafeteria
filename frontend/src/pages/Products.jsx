import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, MoreVertical, Filter, Coffee } from 'lucide-react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    disponible: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/productos/'),
        api.get('/categorias/')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        id_categoria: product.id_categoria,
        disponible: product.disponible
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        id_categoria: '',
        disponible: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id_producto}/`, formData);
      } else {
        await api.post('/productos/', formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}/`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* HEADER SECTION - FIXED ORDER */}
      <div className="page-header">
        <div className="page-title">
          <h2>Productos</h2>
          <p>Gestión de productos registrados para la venta.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary"
        >
          Crear Producto
        </button>
      </div>

      {/* SEARCH SECTION */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', border: '1px solid #ddd', borderRadius: '4px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="glass-card animate-pulse h-64"></div>
          ))
        ) : filteredProducts.map((product) => (
          <motion.div
            key={product.id_producto}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card clickable-card flex flex-col gap-4 relative group"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(product)}
                className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 text-white transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(product.id_producto)}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-primary mb-2">
              <Coffee size={32} />
            </div>
            
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{product.nombre}</h3>
              </div>
              <p className="text-text-muted text-sm line-clamp-2 mt-1 min-h-[40px]">
                {product.descripcion || 'Sin descripción'}
              </p>
            </div>

            <div className="mt-auto flex justify-between items-center">
              <span className="text-2xl font-bold text-white">Bs. {product.precio}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                product.disponible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {product.disponible ? 'Disponible' : 'Agotado'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-glass rounded-lg">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="input-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label>Precio (Bs.)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Categoría</label>
                    <select
                      required
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                    >
                      <option value="">Seleccionar...</option>
                      {categories.map(c => (
                        <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Descripción</label>
                  <textarea
                    rows="3"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="disponible"
                    className="w-5 h-5 !p-0"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                  />
                  <label htmlFor="disponible" className="cursor-pointer">Disponible para la venta</label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline flex-1">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingProduct ? 'Actualizar' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
