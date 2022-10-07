const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();


router.get('/listar', async function (req, res) {
    let rotas = await queryDB("select * from rota");
    res.json(rotas);
});

module.exports = router;