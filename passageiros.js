const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();


router.get('/listar', async function (req, res) {
    let autores = await queryDB("select * from passageiro");
    res.json(autores);
});

module.exports = router;