import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Users } from 'lucide-react';
import api from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    celular: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clientes/');
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        ci: client.ci,
        nombre: client.nombre,
        celular: client.celular || ''
      });
    } else {
      setEditingClient(null);
      setFormData({ ci: '', nombre: '', celular: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.put(`/clientes/${editingClient.id_cliente}/`, formData);
      } else {
        await api.post('/clientes/', formData);
      }
      fetchClients();
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al guardar el cliente');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}/`);
        fetchClients();
      } catch (err) {
        alert('Error al eliminar el cliente');
      }
    }
  };

  const filteredClients = clients.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.ci.includes(search)
  );

  return (
    <div className="animate-fade-in">
      {/* HEADER SECTION */}
      <div className="page-header">
        <div className="page-title">
          <h2>Clientes</h2>
          <p>Gestiona la base de datos de tus clientes frecuentes.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          Registrar Cliente
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por Nombre o CI..." 
            className="form-input"
            style={{ width: '100%', paddingLeft: '3rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CI</th>
              <th>Nombre Completo</th>
              <th>Celular</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Cargando clientes...</td></tr>
            ) : filteredClients.map((client) => (
              <tr key={client.id_cliente}>
                <td style={{ fontWeight: '700' }}>{client.ci}</td>
                <td>{client.nombre}</td>
                <td>{client.celular || 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={() => handleOpenModal(client)} className="btn btn-outline" style={{ padding: '5px 10px' }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(client.id_cliente)} className="btn btn-outline" style={{ padding: '5px 10px', color: '#dc2626' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="modal-content" style={{ position: 'relative', zIndex: 10, maxWidth: '450px' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Documento CI</label>
                  <input type="text" required value={formData.ci} onChange={(e) => setFormData({...formData, ci: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Nombre Completo</label>
                  <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Celular</label>
                  <input type="text" value={formData.celular} onChange={(e) => setFormData({...formData, celular: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingClient ? 'Actualizar' : 'Registrar'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clients;
