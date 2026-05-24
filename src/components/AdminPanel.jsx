import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'COOKIE_CLASSIC_STANDARD',
    imageFile: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:8080/admin/products', {
      credentials: 'include'
    });
    const data = await res.json();
    setProducts(data);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      imageFile: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Режим редактирования — отправляем только изменённые поля
      const updates = {};
      if (formData.name !== editingProduct.name) updates.name = formData.name;
      if (String(formData.price) !== String(editingProduct.price)) updates.price = formData.price;
      if (formData.category !== editingProduct.category) updates.category = formData.category;

      // Обновляем текстовые поля
      if (Object.keys(updates).length > 0) {
        const response = await fetch(`http://localhost:8080/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
          credentials: 'include'
        });
        if (!response.ok) {
          setMessage('❌ Ошибка обновления товара');
          setTimeout(() => setMessage(''), 2000);
          return;
        }
      }

      // Обновляем картинку, если выбрана
      if (formData.imageFile) {
        const imageData = new FormData();
        imageData.append('imageFile', formData.imageFile);
        const response = await fetch(`http://localhost:8080/admin/products/${editingProduct.id}/image`, {
          method: 'PATCH',
          body: imageData,
          credentials: 'include'
        });
        if (!response.ok) {
          setMessage('❌ Ошибка обновления картинки');
          setTimeout(() => setMessage(''), 2000);
          return;
        }
      }

      setMessage('✅ Товар обновлён');
    } else {
      // Режим создания — отправляем всё через FormData
      const form = new FormData();
      form.append('name', formData.name);
      form.append('price', formData.price);
      form.append('category', formData.category);
      if (formData.imageFile) form.append('imageFile', formData.imageFile);
      else {
        setMessage('❌ Выберите картинку');
        setTimeout(() => setMessage(''), 2000);
        return;
      }

      const res = await fetch('http://localhost:8080/admin/products', {
        method: 'POST',
        body: form,
        credentials: 'include'
      });
      if (!res.ok) {
        setMessage('❌ Ошибка создания товара');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
      setMessage('✅ Товар создан');
    }

    // Сброс формы и обновление списка
    setFormData({ name: '', price: '', category: 'COOKIE_CLASSIC_STANDARD', imageFile: null });
    setEditingProduct(null);
    fetchProducts();
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    const response = await fetch(`http://localhost:8080/admin/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok) {
      setMessage('✅ Товар удалён');
      fetchProducts();
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('❌ Ошибка удаления');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{editingProduct ? '✏️ Редактировать товар' : '➕ Добавить товар'}</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
        <input
          type="text"
          name="name"
          placeholder="Название"
          className="form-control mb-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required={!editingProduct}
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          className="form-control mb-2"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required={!editingProduct}
        />
        <select
          name="category"
          className="form-control mb-2"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="COOKIE_CLASSIC_STANDARD">Классическое печенье</option>
          <option value="COOKIE_CLASSIC_BRANDED">Брендированное печенье</option>
          <option value="COOKIE_CUSTOM_STANDARD">Печенье с текстом клиента</option>
          <option value="COOKIE_CUSTOM_BRANDED">Печенье с текстом + бренд</option>
          <option value="POSTCARD_ONE_CHOCOLATE">Открытка с 1 шоколадкой</option>
          <option value="POSTCARD_FOUR_CHOCOLATES">Открытка с 2 шоколадками</option>
        </select>
        <input
          type="file"
          name="imageFile"
          className="form-control mb-2"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
        />
        <button type="submit" className="btn btn-primary">
          {editingProduct ? 'Обновить' : 'Создать'}
        </button>
        {editingProduct && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', price: '', category: 'COOKIE_CLASSIC_STANDARD', imageFile: null });
            }}
          >
            Отмена
          </button>
        )}
      </form>

      <h2>📋 Товары</h2>
      <div className="row">
        {products.map(p => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={`http://localhost:8080${p.imageUrl}`}
                className="card-img-top"
                alt={p.name}
                style={{ height: '150px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              <div className="card-body">
                <h5>{p.name}</h5>
                <p>{p.price} ₽</p>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>
                  ✏️ Редактировать
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                  🗑️ Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;