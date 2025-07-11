const userModel = require('../models/userModel');

// Criar usuário
function criarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    userModel.criarUsuario(nome, email, senha, (err, userId) => {
        if (err) return res.status(500).json({ erro: 'Erro ao criar usuário.' });
        res.status(201).json({ id: userId, nome, email });
    });
}