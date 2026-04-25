import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, Trash2, X, User, CreditCard, Calendar } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id_cliente: '',
    tipo_pago: 'Efectivo',
    total: '0.00'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordRes, cliRes] = await Promise.all([
        api.get('/pedidos/'),
        api.get('/clientes/')
      ]);
      setOrders(ordRes.data);
      setClients(cliRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ id_cliente: '', tipo_pago: 'Efectivo', total: '0.00' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pedidos/', {
        ...formData,
        fecha_pedido: new Date().toISOString()
      });
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al registrar el pedido');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas cancelar/eliminar este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}/`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    const client = clients.find(c => c.id_cliente === o.id_cliente);
    return client?.nombre.toLowerCase().includes(search.toLowerCase()) || o.id_pedido.toString().includes(search);
  });

  return (
    <div className="animate-fade-in px-6 py-4">
      {/* HEADER: Estándar CAFTÉA */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pedidos</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Gestiona las ventas y el historial de pedidos</p>
        </div>
        <button 
          onClick={handleOpenModal} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Nueva Venta
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por cliente o ID de pedido..." 
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
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Orden</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Pago</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">Procesando pedidos...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">No hay pedidos registrados</td></tr>
            ) : (
              filteredOrders.map((order) => {
                const client = clients.find(c => c.id_cliente === order.id_cliente);
                return (
                  <tr key={order.id_pedido} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-400">#{order.id_pedido}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-800">{client?.nombre || 'Consumidor Final'}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-500">{new Date(order.fecha_pedido).toLocaleDateString()}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">${parseFloat(order.total).toFixed(2)}</span></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.tipo_pago === 'Efectivo' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.tipo_pago}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(order.id_pedido)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Nueva Venta */}
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
                <h3 className="text-xl font-bold text-slate-800">Nuevo Pedido</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cliente</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-300" size={18} />
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none"
                        value={formData.id_cliente}
                        onChange={(e) => setFormData({...formData, id_cliente: e.target.value})}
                      >
                        <option value="">Seleccionar cliente...</option>
                        {clients.map(c => (
                          <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Método de Pago</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 text-slate-300" size={18} />
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none"
                        value={formData.tipo_pago}
                        onChange={(e) => setFormData({...formData, tipo_pago: e.target.value})}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monto Total ($)</label>
                    <input 
                      type="number" step="0.01" required
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-800 font-bold text-lg focus:ring-2 focus:ring-slate-900/10 transition-all"
                      value={formData.total}
                      onChange={(e) => setFormData({...formData, total: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95">Confirmar Venta</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
