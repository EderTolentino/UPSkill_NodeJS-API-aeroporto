const {queryDB, connection} = require("./connection");
require('dotenv').config();
const express = require('express');
const app = express();

// Para x-www-form-urlencoded
app.use(express.urlencoded());

// Para json
app.use(express.json());

//app.use("/autores", require("./autores.js"));
//app.use("/livros", require("./livros.js"));
app.use("/passageiros", require("./passageiros.js"));
app.use("/avioes", require("./avioes.js"));
app.use("/bilhetes", require("./bilhetes.js"));
app.use("/rotas", require("./rotas.js"));
app.use("/voos", require("./voos.js"));

app.listen(3000);