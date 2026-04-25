import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Tags, 
  ShoppingCart, 
  UserCheck,
  FileText
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Clients from './pages/Clients';
import Orders from './pages/Orders';

function App() {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/productos', name: 'Productos', icon: <Package size={18} /> },
    { path: '/categorias', name: 'Categorias', icon: <Tags size={18} /> },
    { path: '/clientes', name: 'Clientes', icon: <Users size={18} /> },
    { path: '/empleados', name: 'Empleados', icon: <UserCheck size={18} /> },
    { path: '/pedidos', name: 'Pedidos', icon: <ShoppingCart size={18} /> },
    { path: '/bitacora', name: 'Bitácora', icon: <FileText size={18} /> },
  ];

  return (
    <div className="app-container">
      {/* SIDEBAR ORIGINAL REFORMULADO */}
      <aside className="sidebar">
        <div className="logo-section">
          <h1>CAFTÉA</h1>
        </div>

        <nav style={{ marginTop: '1rem' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="logout-container">
          <button className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/pedidos" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
