const {queryDB, connection} = require("./connection");
require('dotenv').config();
const express = require('express');
const app = express();

// Para x-www-form-urlencoded
app.use(express.urlencoded());

// Para json
app.use(express.json());

app.use("/avioes", require("./avioes.js"));
app.use("/bilhetes", require("./bilhetes.js"));
app.use("/rotas", require("./rotas.js"));
app.use("/voos", require("./voos.js"));
app.use("/aeroportos", require("./aeroportos.js"));

app.listen(3000);