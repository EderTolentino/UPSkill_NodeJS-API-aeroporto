const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();


router.get('/listar', async function (req, res) {
    let avioes = await queryDB("select * from aviao");
    res.json(avioes);
});

module.exports = router;