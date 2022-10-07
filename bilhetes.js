const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();


router.get('/listar', async function (req, res) {
    let bilhetes = await queryDB("select * from bilhete");
    res.json(bilhetes);
});

module.exports = router;