const {queryDB, connection} = require("./connection");
require('dotenv').config();
const express = require('express');
const app = express();

// Para x-www-form-urlencoded
app.use(express.urlencoded());

// Para json
app.use(express.json());


app.get('/', function (req, res) {
    res.send('Hello World')
})


// LISTAR AUTORES EXISTENTES:
app.get('/autores', async function (req, res) {
    let autores = await queryDB("select * from autor");
    res.json(autores);
});

// LISTAR LIVROS EXISTENTES:
app.get('/livros', async function (req, res) {
    let livros = await queryDB("SELECT * FROM livro");
    res.json(livros);
});
// http://localhost:3000/autores

// LISTAR LIVROS DE UM AUTOR
app.get('/autor/:id_autor/livros', async function (req, res) {
    let livros = await queryDB(`SELECT * FROM livro WHERE autor = ?`, [req.params.id_autor]);
    res.json(livros);
});
// http://localhost:3000/autor/6/livros

// LISTAR VENDAS DE UM LIVRO
app.get('/livro/:id_livro/vendas', async function (req, res) {
    let vendas = await queryDB(`SELECT * FROM venda WHERE livro = ?`, [req.params.id_livro]);
    res.json(vendas);
});
// http://localhost:3000/livro/1/vendas

// Criar autor
app.post('/autor/criar', async function (req, res) {
    let autor = await queryDB("SELECT * FROM autor WHERE nome = ?", [req.body.nome]);

    if (autor.length > 0) {
        res.status(400).send("Já existe um autor com esse nome");
        return;
    }

    await queryDB("INSERT INTO autor SET ?", {
        nome: req.body.nome
    });

    let autores = await queryDB("SELECT * FROM autor");
    res.json(autores);
})

// Criar livros
app.post('/livros/criar', async function (req, res) {
    await queryDB("INSERT INTO livro SET ?", {
        titulo: req.body.titulo,
        autor: req.body.autor,
        ano_publicacao: req.body.ano_publicacao
    });

    let livros = await queryDB("SELECT * FROM livro WHERE autor = ?", [req.body.autor]);
    res.json(livros);
})


app.listen(3000)