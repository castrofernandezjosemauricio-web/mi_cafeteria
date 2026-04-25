import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, Plus } from 'lucide-react';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categorias/');
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ nombre: category.nombre, descripcion: category.descripcion || '' });
    } else {
      setEditingCategory(null);
      setFormData({ nombre: '', descripcion: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categorias/${editingCategory.id_categoria}/`, formData);
      } else {
        await api.post('/categorias/', formData);
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al guardar la categoría');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categorias/${id}/`);
        fetchCategories();
      } catch (err) {
        alert('No se puede eliminar la categoría porque tiene productos asociados.');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in px-6 py-4">
      {/* HEADER: Título a la izquierda, Botón a la derecha */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Categorías</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Gestiona los grupos de productos de tu negocio</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar categorías..." 
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
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 w-24">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Descripción</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">Cargando categorías...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No se encontraron categorías</td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id_categoria} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">#{category.id_categoria}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{category.nombre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 line-clamp-1">{category.descripcion || 'Sin descripción'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(category)} 
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id_categoria)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
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

      {/* MODAL: Limpio y Premium */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre de Categoría</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Cafetería, Postres..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
                    <textarea 
                      placeholder="Breve descripción de la categoría..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all resize-none h-32"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 px-6 py-3 border border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                  >
                    {editingCategory ? 'Guardar Cambios' : 'Registrar'}
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

export default Categories;
