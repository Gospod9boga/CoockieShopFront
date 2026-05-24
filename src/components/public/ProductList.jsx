import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${product.name} добавлен в корзину!`);
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
      <p className="mt-3">Загрузка...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger text-center mt-5" role="alert">
      Ошибка загрузки: {error}
    </div>
  );

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4" style={{ background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          🧁 Предсказания со вкусом
        </h1>
      </div>

      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
              {product.imageUrl && (
                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                  <img 
                    src={`http://localhost:8080${product.imageUrl}`}
                    className="card-img-top w-100 h-100 object-fit-cover" 
                    alt={product.name}
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                  />
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{product.name}</h5>
                <p className="card-text text-muted mb-3">
                  <small>{product.category?.replace(/_/g, ' ').toLowerCase()}</small>
                </p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="h4 mb-0 fw-bold" style={{ color: '#8e44ad' }}>{product.price} ₽</span>
                  <button 
                    className="btn rounded-pill px-4"
                    style={{ backgroundColor: '#f1c40f', borderColor: '#f1c40f', color: '#5d3a1a', fontWeight: '600' }}
                    onClick={() => addToCart(product)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f39c12'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1c40f'}
                  >
                    🛒 В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;