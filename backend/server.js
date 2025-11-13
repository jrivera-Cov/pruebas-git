const path = require('path');
const express = require('express');
const cors = require('cors');
const connection = require('./db');
const pool = require('./db');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = 3001;
const https = require('https');
app.use(cors());
app.use(express.json());


/* --- RUTAS PARA LA TABLA FISICAS --- */

// Obtener todos
app.get('/api/fds/ejemplo', async (req, res) => {
  const query = 'SELECT  id, nombre, numero  FROM ejemplo ORDER BY id ASC';
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Eliminar registro de la tabla ejemplos por ID
app.delete('/api/fds/ejemplo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ perror: 'ID inválido' });
  }

  try {
    const deleteQuery = 'DELETE FROM ejemplo WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ perror: 'Registro no encontrado' });
    }

    // Reordenar IDs después de la eliminación
    const reorderQuery = `
      WITH filas_ordenadas AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS nuevo_id
        FROM ejemplo
      )
      UPDATE ejemplo
      SET id = filas_ordenadas.nuevo_id
      FROM filas_ordenadas
      WHERE ejemplo.id = filas_ordenadas.id;
    `;
    await pool.query(reorderQuery);

    res.status(200).json({ message: 'Registro eliminado correctamente', deletedRecord: result.rows[0] });
  } catch (err) {
    console.error('Error SQL:', err.message);
    res.status(500).json({ perror: 'Error al eliminar el registro', error: err.message });
  }
});



// UPDATE registro por id (id es texto)
app.put('/api/fds/ejemplo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {nombre, numero } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ perror: 'ID inválido' });
  }

  try {
    const query = `
      UPDATE ejemplo
      SET nombre = $1, numero= $2
      WHERE id = $3 RETURNING *`;

    const result = await pool.query(query, [ nombre, numero,  id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ perror: 'Registro no encontrado' });
    }

    res.status(200).json({ message: 'Registro actualizado correctamente', updatedRecord: result.rows[0] });
  } catch (err) {
    console.error('Error SQL:', err.message);
    res.status(500).json({ perror: 'Error al actualizar el registro', error: err.message });
  }
});


//insertar fisicas 
app.post('/api/fds/ejemplo', async (req, res) => {
  const { id, nombre, numero } = req.body;

  try {
     const idQuery = 'SELECT MAX(id) AS last_id FROM ejemplo';
    const idResult = await pool.query(idQuery);
    const lastId = idResult.rows[0].last_id || 0;

    const newId = lastId + 1;

    const query = `
      INSERT INTO ejemplo ( id, nombre, numero )
      VALUES ($1, $2, $3) RETURNING *`;

    const result = await pool.query(query, [newId,nombre, numero]);

    res.status(201).json({ message: 'Registro insertado correctamente', newRecord: result.rows[0] });
  } catch (err) {
    console.error('Error SQL:', err.message);
    res.status(500).json({ perror: 'Error al insertar el registro', error: err.message });
  }
});



app.listen(PORT, '0.0.0.0',() => {
 console.log(`Servidor corriendo en http://99.90.128.245:${PORT}`);
});