import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const dataMasVendidos = [
  { name: 'Café Americano', value: 2 },
  { name: 'Te', value: 0 },
  { name: 'Tres leches', value: 0 },
  { name: 'Pie', value: 0 },
  { name: 'pie', value: 0 },
];

const dataMenosVendidos = [
  { name: 'Café Americano', value: 2 },
];

const dataVentasPorProducto = [
  { name: 'Café Americano', value: 20 },
  { name: 'Te', value: 0 },
  { name: 'Tres leches', value: 0 },
  { name: 'Pie', value: 0 },
  { name: 'pie', value: 0 },
  { name: 'Pie de Manzana', value: 0 },
];

const dataPie = [
  { name: 'Vendidos', value: 1 },
  { name: 'Cancelados', value: 0 },
];

const COLORS_PIE = ['#1a7a44', '#e2e8f0'];

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary)' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Bienvenido, Elvis Arias Romero</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">GANANCIA</div>
          <div className="stat-value">20.00 Bs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PÉRDIDA</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>0.00 Bs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PEDIDOS REALIZADOS</div>
          <div className="stat-value">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PRODUCTOS VENDIDOS</div>
          <div className="stat-value">2</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-title">Productos más vendidos</div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMasVendidos}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '11px'}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1e7e4e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">Pedidos vendidos vs cancelados</div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">Productos menos vendidos</div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMenosVendidos}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '11px'}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f6ad55" radius={[4, 4, 0, 0]} barSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">Ventas por producto</div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataVentasPorProducto}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '11px'}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#044d32" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
