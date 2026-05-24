import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/public/ProductList';
import AdminPanel from './components/AdminPanel';
import AdminOrders from './components/AdminOrders';
import Cart from './components/public/Cart';
import Login from './components/Login';

function App() {
  const [page, setPage] = useState('catalog');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('products');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/cart') {
      setPage('cart');
    } else if (path === '/admin') {
      setPage('admin');
    } else {
      setPage('catalog');
    }
  }, []);

  const navigate = (p) => {
    setPage(p);
    if (p !== 'admin') setAdminTab('products');
    window.history.pushState({}, '', p === 'catalog' ? '/' : `/${p}`);
  };

  if (page === 'admin' && !isAdminLoggedIn) {
    return <Login onLogin={() => setIsAdminLoggedIn(true)} />;
  }

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand">🍪 Десертико</span>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li>
                <button className={`btn ${page === 'catalog' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => navigate('catalog')}>
                  Каталог
                </button>
              </li>
              <li>
                <button className={`btn ${page === 'cart' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => navigate('cart')}>
                  Корзина
                </button>
              </li>
              {isAdminLoggedIn && (
                <li>
                  <button className={`btn ${page === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => navigate('admin')}>
                    Админка
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {page === 'catalog' && <ProductList />}
      {page === 'cart' && <Cart />}
      {page === 'admin' && (
        <div>
          <ul className="nav nav-tabs mb-3" style={{ cursor: 'pointer' }}>
            <li className="nav-item">
              <button className={`nav-link ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}>
                Товары
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}>
                Заказы
              </button>
            </li>
          </ul>
          {adminTab === 'products' && <AdminPanel />}
          {adminTab === 'orders' && <AdminOrders />}
        </div>
      )}
    </div>
  );
}

export default App;