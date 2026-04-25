import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Menu, Coffee } from 'lucide-react';

// Pages
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Clients = React.lazy(() => import('./pages/Clients'));
const Orders = React.lazy(() => import('./pages/Orders'));

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
  <div
    onClick={onClick}
    className={`nav-item ${active ? 'nav-item-active' : ''}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Productos', path: '/productos' },
    { icon: Tags, label: 'Categorías', path: '/categorias' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/pedidos' },
  ];

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {isAuthenticated && location.pathname !== '/login' && (
        <aside className="sidebar">
          {/* LOGO SECTION */}
          <div className="logo-section">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Coffee size={40} color="#064e3b" />
              <h1 style={{ color: '#064e3b', fontWeight: 900, marginTop: '10px', letterSpacing: '2px' }}>CAFTÉA</h1>
            </div>
          </div>

          {/* TOGGLE BUTTON */}
          <div style={{ padding: '0.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
             <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px', cursor: 'pointer' }}
             >
                <Menu size={20} />
             </button>
          </div>

          {/* MENU */}
          <nav className="nav-menu">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </nav>

          {/* LOGOUT */}
          <div className="nav-item" onClick={handleLogout} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
             <LogOut size={18} />
             <span>Cerrar Sesión</span>
          </div>
        </aside>
      )}

      <main className="main-content">
        <div style={{ position: 'relative' }}>
          <React.Suspense fallback={<div style={{ padding: '2rem' }}>Cargando...</div>}>
            <Routes>
              <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
