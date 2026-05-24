import React, { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/admin/orders', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
        credentials: 'include'
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Удалить заказ?')) return;
    try {
      const res = await fetch(`http://localhost:8080/admin/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-5">Загрузка заказов...</div>;
  if (error) return <div className="alert alert-danger">Ошибка: {error}</div>;
  if (orders.length === 0) return <div className="text-center mt-5">Нет заказов</div>;

  return (
    <div className="container mt-4">
      <h2>📦 Заказы</h2>
      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Клиент</th><th>Телефон</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.clientName}</td>
              <td>{order.clientNumber}</td>
              <td>{order.sumOrder} ₽</td>
              <td>
                <select value={order.orderStatus} onChange={e => updateStatus(order.orderId, e.target.value)} className="form-select form-select-sm" style={{ width: '140px' }}>
                  <option value="CREATED">Создан</option>
                  <option value="CONFIRMED">Подтверждён</option>
                  <option value="SHIPPED">Отправлен</option>
                  <option value="DELIVERED">Доставлен</option>
                  <option value="CANCELLED">Отменён</option>
                </select>
              </td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => setSelectedOrder(order)}>📄</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteOrder(order.orderId)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Заказ #{selectedOrder.orderId}</h5>
                <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Клиент:</strong> {selectedOrder.clientName}</p>
                <p><strong>Телефон:</strong> {selectedOrder.clientNumber}</p>
                <p><strong>Дата:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                <p><strong>Статус:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Сумма:</strong> {selectedOrder.sumOrder} ₽</p>
                <h6>Состав:</h6>
                <ul>
                  {selectedOrder.orderItem?.map((item, idx) => (
                    <li key={idx}>{item.productName} — {item.quantity} шт. × {item.price} ₽</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;