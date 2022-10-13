const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();

// FUNÇÃO PARA LISTAR OS AEROPORTOS - INCLUINDO O PAÍS
router.get('/listar', async function (req, res) {
    let aeroportos = await queryDB("SELECT a.Sigla_Aeroporto, a.Cidade, c.Pais, a.Nome_Aeroporto FROM aeroporto a, cidade c WHERE a.Cidade = c.Cidade");
    res.json(aeroportos);
});

// FUNÇÃO PARA EDITAR O NOME DO AEROPORTO
router.post('/:sigla_aeroporto/editar', async function (req, res) {
    let aeroporto_existe = await queryDB("SELECT * FROM aeroporto WHERE Sigla_Aeroporto = ?", [req.params.sigla_aeroporto]);

    if(aeroporto_existe.length === 0){
        res.status(400).send('Este aeroporto não existe e não pode ser editado!');
        return;
    } else {
        await queryDB("UPDATE aeroporto SET Nome_Aeroporto = ? WHERE Sigla_Aeroporto = ?", [req.body.nome_aeroporto, req.params.sigla_aeroporto]);
        let aeroportos = await queryDB("SELECT a.Sigla_Aeroporto, a.Cidade, c.Pais, a.Nome_Aeroporto FROM aeroporto a, cidade c WHERE a.Cidade = c.Cidade");
        res.json(aeroportos);
    }
});

module.exports = router;