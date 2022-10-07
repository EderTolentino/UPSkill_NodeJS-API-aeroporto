const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();

router.get('/listar', async function (req, res) {
    let autores = await queryDB("select * from autor");
    res.json(autores);
});

router.get('/:id_autor/livros', async function (req, res) {
    let livros = await queryDB(`SELECT * FROM livro WHERE autor = ?`, [req.params.id_autor]);
    res.json(livros);
});

router.post('/criar', async function (req, res) {
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

module.exports = router;




