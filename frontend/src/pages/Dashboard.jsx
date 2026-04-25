import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Package, Plus } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }) => (
    <motion.div
    whileHover={{ y: -5 }}
    className="glass-card clickable-card flex flex-col gap-4"
  >
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trendValue}%</span>
      </div>
    </div>
    <div>
      <p className="text-text-muted text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventas: 'Bs. 12,450',
    pedidos: '145',
    clientes: '89',
    productos: '32'
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/pedidos/');
        setRecentOrders(res.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in p-8">
      {/* HEADER ORDER */}
      <div className="border-b border-white/5 pb-8">
        <h2 className="text-4xl font-black tracking-tight text-white">Dashboard</h2>
        <p className="text-text-muted mt-2 font-medium italic">Bienvenido de nuevo al panel de control de CAFTÉA.</p>
      </div>

      {/* Stats Section */}
      <section className="dashboard-grid">
        <StatCard 
          icon={DollarSign} 
          label="Ingresos Totales" 
          value={stats.ventas} 
          trend="up" 
          trendValue="12.5" 
          color="green" 
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Pedidos Hoy" 
          value={stats.pedidos} 
          trend="up" 
          trendValue="8.2" 
          color="blue" 
        />
        <StatCard 
          icon={Users} 
          label="Clientes Nuevos" 
          value={stats.clientes} 
          trend="down" 
          trendValue="3.1" 
          color="purple" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Productos Activos" 
          value={stats.productos} 
          trend="up" 
          trendValue="4.5" 
          color="orange" 
        />
      </section>

      {/* Tables and Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Ventas Recientes</h3>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Ver Historial</button>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Referencia</th>
                  <th style={{ textAlign: 'left' }}>Cliente</th>
                  <th style={{ textAlign: 'left' }}>Monto</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id_pedido}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>#TRX-{order.id_pedido}</td>
                    <td>{order.id_cliente_nombre || 'Cliente Final'}</td>
                    <td style={{ fontWeight: '700' }}>Bs. {order.total}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        backgroundColor: order.estado === 'Completado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: order.estado === 'Completado' ? '#10b981' : '#f59e0b'
                      }}>
                        {order.estado.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Operaciones Rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={20} /> Nueva Venta
            </button>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Package size={20} /> Inventario
            </button>
             <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Users size={20} /> Clientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
