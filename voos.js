const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();


router.get('/listar', async function (req, res) {
    let voos = await queryDB("select * from voo");
    res.json(voos);
});

module.exports = router;