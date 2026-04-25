import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Eye, Filter } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/pedidos/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.id_cliente_nombre || 'Cliente Final').toLowerCase().includes(search.toLowerCase()) ||
    o.id_pedido.toString().includes(search)
  );

  return (
    <div className="animate-fade-in">
      {/* HEADER SECTION - Standard Order */}
      <div className="page-header">
        <div className="page-title">
          <h2>Pedidos / Ventas</h2>
          <p>Historial completo de las transacciones realizadas en CAFTÉA.</p>
        </div>
        <button className="btn btn-primary">
          Nueva Venta
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por ID o Cliente..." 
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', border: '1px solid #ddd', borderRadius: '4px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Filter size={16} /> Filtros
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cliente / Responsable</th>
              <th>Total</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Cargando historial de ventas...</td></tr>
            ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.id_pedido}>
                <td style={{ fontWeight: '800', color: 'var(--accent)' }}>#TRX-{order.id_pedido}</td>
                <td>{new Date(order.fecha).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700' }}>{order.id_cliente_nombre || 'Cliente Final'}</span>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>Atendido por: {order.id_empleado_nombre || 'Admin'}</span>
                  </div>
                </td>
                <td style={{ fontWeight: '900' }}>Bs. {order.total}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    backgroundColor: order.estado === 'Completado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: order.estado === 'Completado' ? '#10b981' : '#f59e0b'
                  }}>
                    {order.estado.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline" style={{ padding: '5px 10px' }}>
                       <Eye size={16} />
                    </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No se encontraron pedidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
