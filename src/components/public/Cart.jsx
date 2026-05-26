import React, { useState, useEffect } from 'react';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (id, delta) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        if (newQ <= 0) return null;
        return { ...item, quantity: newQ };
      }
      return item;
    }).filter(item => item !== null);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    const clientName = prompt('Введите ваше имя:');
    if (!clientName) return;
    
    const clientNumber = prompt('Введите ваш телефон:');
    if (!clientNumber) return;

    const orderData = {
      clientName: clientName,
      clientNumber: clientNumber,
      order: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('http://72.56.240.200:8080/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('✅ Заказ оформлен! Мы свяжемся с вами.');
        localStorage.removeItem('cart');
        setCartItems([]);
        window.location.href = '/';
      } else {
        const errorText = await response.text();
        alert(`❌ Ошибка: ${errorText}`);
      }
    } catch (error) {
      alert(`❌ Ошибка соединения: ${error.message}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>🛒 Корзина пуста</h3>
        <p>Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>🛒 Корзина</h2>
      {cartItems.map(item => (
        <div key={item.id} className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5>{item.name}</h5>
              <p>{item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽</p>
            </div>
            <div>
              <button className="btn btn-sm btn-secondary me-2" onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span className="mx-2">{item.quantity}</span>
              <button className="btn btn-sm btn-secondary me-2" onClick={() => updateQuantity(item.id, 1)}>+</button>
              <button className="btn btn-sm btn-danger ms-2" onClick={() => removeItem(item.id)}>Удалить</button>
            </div>
          </div>
        </div>
      ))}
      <h3 className="mt-3">Итого: {totalSum} ₽</h3>
      <p>Товаров: {totalQuantity} шт.</p>
      <button className="btn btn-success mt-2" onClick={handleCheckout}>
        Оформить заказ
      </button>
    </div>
  );
}

export default Cart;