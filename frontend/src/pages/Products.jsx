import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, Plus, Package, DollarSign, Tag } from 'lucide-react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: ''
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
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        stock: product.stock,
        id_categoria: product.id_categoria
      });
    } else {
      setEditingProduct(null);
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '' });
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
      alert('Error al guardar el producto. Verifica los campos.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}/`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar el producto.');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in px-6 py-4">
      {/* HEADER: Título izquierda, Botón derecha */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Administra el inventario y precios de tu cafetería</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Producto</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Categoría</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Precio</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">Cargando inventario...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">No hay productos registrados</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id_producto} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{product.nombre}</span>
                      <span className="text-xs text-slate-400">ID: {product.id_producto}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {categories.find(c => c.id_categoria === product.id_categoria)?.nombre || 'S/C'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-600">${parseFloat(product.precio).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                      {product.stock} uds.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id_producto)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Formulario Premium */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingProduct ? 'Editar Producto' : 'Registrar Producto'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre del Producto</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 text-slate-300" size={18} />
                      <input 
                        type="text" required placeholder="Ej: Capuccino Grande"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoría</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 text-slate-300" size={18} />
                      <select 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none"
                        value={formData.id_categoria}
                        onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                      >
                        <option value="">Seleccionar categoría...</option>
                        {categories.map(cat => (
                          <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Precio ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-slate-300" size={18} />
                      <input 
                        type="number" step="0.01" required placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all"
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Stock Inicial</label>
                    <input 
                      type="number" required placeholder="0"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
                    <textarea 
                      placeholder="Ingredientes o detalles..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all resize-none h-24"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95">
                    {editingProduct ? 'Guardar Cambios' : 'Registrar'}
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
