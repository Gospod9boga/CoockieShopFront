import React, { useState } from 'react';

function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://72.56.240.200:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: login, password: password }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onLogin(true);
        } else {
          setError('Неверный логин или пароль');
        }
      } else {
        setError('Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3>Вход в админку</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Логин</label>
                  <input
                    type="text"
                    className="form-control"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Войти
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
