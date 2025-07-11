const userModel = require('../models/userModel');

// Criar usuário
function criarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    userModel.criarUsuario(nome, email, senha, (err, userId) => {
        if (err) return res.status(500).json({ erro: 'Erro ao criar usuário.' });
        res.status(201).json({ id: userId, nome, email });
    });
}

// Adicionar resultado
function adicionarResultado(req, res) {
    const { userId, resultado } = req.body;
    userModel.registrarResultado(userId, resultado, (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao registrar resultado.' });
        res.status(200).json({ mensagem: 'Resultado registrado com sucesso.' });
    });
}

// Buscar histórico
function buscarHistorico(req, res) {
    const userId = req.params.id;
    userModel.buscarHistorico(userId, (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar histórico.' });
        res.status(200).json(rows);
    });
}

module.exports = {
    criarUsuario,
    adicionarResultado,
    buscarHistorico
};