const db = require('../utils/dbConnection');

// Criar um novo usuário
function criarUsuario(nome, email, senha, callback) {
    const query = 'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)';
    db.run(query, [nome, email, senha], function (err) {
        callback(err, this?.lastID);
    });
}

// Registrar um novo resultado no histórico
function registrarResultado(userId, resultado, callback) {
    const query = 'INSERT INTO historico (user_id, resultado) VALUES (?, ?)';
    db.run(query, [userId, resultado], function (err) {
        callback(err);
    });
}

// Buscar histórico por usuário
function buscarHistorico(userId, callback) {
    const query = 'SELECT * FROM historico WHERE user_id = ? ORDER BY data_registro';
    db.all(query, [userId], callback);
}

module.exports = {
    criarUsuario,
    registrarResultado,
    buscarHistorico
};