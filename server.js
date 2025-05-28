const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const db = new sqlite3.Database('./reservas.db');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Banco de dados
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      mesa INTEGER NOT NULL,
      pessoas INTEGER NOT NULL,
      status TEXT DEFAULT 'pendente',
      garcom TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Criar reserva
  socket.on('criarReserva', (dados, callback) => {
    db.get(
      `SELECT * FROM reservas WHERE mesa = ? AND data = ? AND hora = ? AND status = 'pendente'`,
      [dados.mesa, dados.data, dados.hora],
      (err, row) => {
        if (err) return callback({ success: false, message: 'Erro no servidor' });
        if (row) return callback({ success: false, message: 'Mesa já reservada para este horário' });

        db.run(
          `INSERT INTO reservas (nome, data, hora, mesa, pessoas) VALUES (?, ?, ?, ?, ?)`,
          [dados.nome, dados.data, dados.hora, dados.mesa, dados.pessoas],
          function(err) {
            if (err) return callback({ success: false, message: 'Erro ao criar reserva' });
            
            callback({ 
              success: true, 
              message: `Reserva criada para ${dados.nome} (Mesa ${dados.mesa})` 
            });
            io.emit('reservaAtualizada');
          }
        );
      }
    );
  });


  socket.on('cancelarReserva', (dados, callback) => {
    db.run(
      `UPDATE reservas SET status = 'cancelada' WHERE nome = ? AND mesa = ? AND status = 'pendente'`,
      [dados.nome, dados.mesa],
      function(err) {
        if (err) return callback({ success: false, message: 'Erro ao cancelar' });
        if (this.changes === 0) return callback({ success: false, message: 'Reserva não encontrada' });
        
        callback({ success: true, message: 'Reserva cancelada com sucesso' });
        io.emit('reservaAtualizada');
      }
    );
  });

  socket.on('confirmarReserva', (dados, callback) => {
    db.run(
      `UPDATE reservas SET status = 'confirmada', garcom = ? 
       WHERE nome = ? AND data = ? AND hora = ? AND status = 'pendente'`,
      [dados.garcom, dados.nome, dados.data, dados.hora],
      function(err) {
        if (err) return callback({ success: false, message: 'Erro ao confirmar' });
        if (this.changes === 0) return callback({ success: false, message: 'Reserva não encontrada' });
        
        callback({ success: true, message: 'Reserva confirmada com sucesso' });
        io.emit('reservaAtualizada');
      }
    );
  });

 
  socket.on('relatorio1', (dados, callback) => {
    db.all(
      `SELECT * FROM reservas WHERE data BETWEEN ? AND ? ORDER BY data, hora`,
      [dados.inicio, dados.fim],
      (err, rows) => {
        if (err) return callback({ success: false, message: 'Erro no relatório' });
        callback({ success: true, data: rows });
      }
    );
  });

  socket.on('relatorio2', (dados, callback) => {
    db.all(
      `SELECT * FROM reservas WHERE mesa = ? ORDER BY data, hora`,
      [dados.mesa],
      (err, rows) => {
        if (err) return callback({ success: false, message: 'Erro no relatório' });
        callback({ success: true, data: rows });
      }
    );
  });

  socket.on('relatorio3', (dados, callback) => {
    db.all(
      `SELECT * FROM reservas WHERE garcom = ? AND status = 'confirmada' ORDER BY data, hora`,
      [dados.garcom],
      (err, rows) => {
        if (err) return callback({ success: false, message: 'Erro no relatório' });
        callback({ success: true, data: rows });
      }
    );
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
