import React, { useState, useEffect } from 'react';
import './App.css';
import Calculadora from './Vistas/Calculadora';

const API_URL = 'http://99.90.128.245:3001/api/fds/ejemplo';

function App() {
  // Estados principales
  const [registros, setRegistros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [vista, setVista] = useState('formulario');

  // 👇 Nuevo estado para la búsqueda
  const [busqueda, setBusqueda] = useState('');

  // Obtener registros desde la API
  const fetchRegistros = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRegistros(data);
    } catch (err) {
      setMensaje('❌ Error al cargar registros');
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // Registrar o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, numero }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(editId ? 'Actualizado correctamente' : 'Registrado correctamente');
        setNombre('');
        setNumero('');
        setEditId(null);
        fetchRegistros();
      } else {
        setMensaje(`Error: ${data.perror || data.error}`);
      }
    } catch (err) {
      setMensaje(`Error de red: ${err.message}`);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Eliminado correctamente');
        fetchRegistros();
      } else {
        setMensaje(`Error: ${data.perror || data.error}`);
      }
    } catch (err) {
      setMensaje(`Error de red: ${err.message}`);
    }
  };

  // Editar
  const handleEdit = (registro) => {
    setNombre(registro.nombre);
    setNumero(registro.numero);
    setEditId(registro.id);
  };

  // 👇 Filtrar registros según lo que se escribe
  const registrosFiltrados = registros.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="App">
      {vista === 'formulario' ? (
        <>
          <h2>Gestión de Registros</h2>

          {/* Botón para cambiar de vista */}
          <button onClick={() => setVista('calculadora')}>Ir a Calculadora</button>

          {/* Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
            <button type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setNombre('');
                  setNumero('');
                }}
              >
                Cancelar
              </button>
            )}
          </form>

          {/* Mensaje */}
          {mensaje && <p>{mensaje}</p>}

          {/* Tabla de registros filtrados */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Número</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nombre}</td>
                  <td>{r.numero}</td>
                  <td>
                    <button onClick={() => handleEdit(r)}>Editar</button>
                    <button onClick={() => handleDelete(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <button onClick={() => setVista('formulario')}>Volver al Formulario</button>
          <Calculadora />
        </>
      )}
    </div>
  );
}

export default App;
