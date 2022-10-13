const trocarSigla = require("./funcoes");
const express = require("express");
const {queryDB} = require("./connection");
const router = express.Router();
const ExcelJS = require("exceljs");

// Listar Voos
router.get('/listar', async function (req, res) {
    let voos = await queryDB("SELECT v.Numero_Voo, v.Rota_ID, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', v.Sigla_Companhia, ca.Nome_Companhia, v.Duracao FROM voo v, companhia_aerea ca, rota r WHERE v.Sigla_Companhia = ca.Sigla_Companhia AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(voos);
    res.json(voos);
});

router.get('/listar_excel', async function (req, res) {
    let voos = await queryDB("SELECT v.Numero_Voo, v.Rota_ID, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', v.Sigla_Companhia, ca.Nome_Companhia, v.Duracao FROM voo v, companhia_aerea ca, rota r WHERE v.Sigla_Companhia = ca.Sigla_Companhia AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(voos);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('voo');
    let colunas = [];
    for (let i in voos[0]) {
        if (voos[0].hasOwnProperty(i)) {
            colunas.push(i);
        }
    }
    let cabecalho = [];
    colunas.forEach((coluna) => {
        cabecalho.push({header: coluna, key: coluna});
    })
    worksheet.columns = cabecalho;
    voos.forEach((dados) => {
        worksheet.addRow(dados);
    })

    let excel = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=dados_voos.xlsx");
    res.send(excel);
});

//pesquisar determinado voo
router.get("/:Numero_Voo/pesquisar", async function (req, res) {
    let nFlight = await queryDB("SELECT v.Numero_Voo, v.Rota_ID, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', v.Sigla_Companhia, ca.Nome_Companhia, v.Duracao FROM voo v, companhia_aerea ca, rota r WHERE v.Sigla_Companhia = ca.Sigla_Companhia AND v.Rota_ID = r.Rota_ID AND v.Numero_Voo = ?", [req.params.Numero_Voo]);
    await trocarSigla(nFlight);
    if (nFlight.length === 0) {
        res.status(400).send("Esse voo não existe... ou será que existe?");
        return;
    }
    res.json(nFlight[0]);
});

// Listar voo com mais bilhetes vendidos
router.get('/estatisticas', async function (req, res) {
    let fullerFlight = await queryDB("SELECT b.Numero_Voo, COUNT(*) AS 'Quantidade_Bilhetes' FROM voo v, bilhete b WHERE v.Numero_Voo = b.Numero_Voo GROUP BY b.Numero_Voo HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM voo v, bilhete b WHERE v.Numero_Voo = b.Numero_Voo GROUP BY b.Numero_Voo);")
    res.json(fullerFlight);
})
// Listar numero de voos/tripulante
router.get('/voos_tripulantes', async function (req, res) {
    let numberFlightsByCrew = await queryDB('SELECT t.Nome AS \'Nome_Tripulante\', t.Apelido AS \'Apelido_Tripulante\', COUNT(h.Numero_Voo) AS \'NumVoos\' FROM historico h, tripulante t WHERE h.Trip_ID = t.Trip_ID GROUP BY h.Trip_ID')
    res.json(numberFlightsByCrew);
})

// Criar voo
router.post('/criar', async function (req, res) {
    let voo = await queryDB("SELECT * FROM voo WHERE Numero_Voo = ?", [req.body.Numero_Voo]);
    if (voo.length > 0) {
        res.status(400).send("Já existe um voo com esse numero");
        return;
    }

    let rota_existe = await queryDB("SELECT * FROM rota WHERE Rota_ID = ?", [req.body.Rota_ID]);
    if(rota_existe.length === 0){
        res.status(400).send("Esta rota não existe");
        return;
    }
    let companhia_existe = await queryDB("SELECT * FROM companhia_aerea WHERE Sigla_Companhia = ?", [req.body.Sigla_Companhia]);
    if(companhia_existe.length === 0){
        res.status(400).send("Esta companhia não existe");
        return;
    }
    await queryDB("INSERT INTO voo SET ?", {
        Rota_ID: req.body.Rota_ID,
        Sigla_Companhia: req.body.Sigla_Companhia,
        Duracao: req.body.Duracao,
    });
    let theFlights = await queryDB("SELECT * FROM voo");
    res.json(theFlights);
})

//apagar voo
router.post('/:Numero_Voo/apagar', async function (req, res) {
    let flightExist = await queryDB('SELECT * From voo Where Numero_Voo = ?', [req.params.Numero_Voo]);
    if (flightExist.length < 1) {
        res.status(400).send("Esse voo ou não existe ou é voo fantasma!");
        return;
    }
    // Verificar se o voo já tem algum horário associado
    let voo_horarios = await queryDB("SELECT * FROM horario WHERE Numero_Voo = ?", [req.params.Numero_Voo]);
    if(voo_horarios.length > 0 ){
        res.status(400).send("Esse voo já tem horários e não pode ser apagado!");
        return;
    }
    await queryDB('DELETE FROM voo WHERE Numero_Voo = ?', [req.params.Numero_Voo]);
    res.status(200).send("Apagado com sucesso!");
})

//Editar duracao de determinado voo
router.post('/:Numero_Voo/editar', async function (req, res) {
    let voo_existe = await queryDB("SELECT * FROM voo WHERE Numero_Voo = ?", [req.params.Numero_Voo]);
    if (voo_existe.length === 0) {
        res.status(400).send("Este voo não existe!");
        return;
    }
    await queryDB('UPDATE voo SET Duracao = ? WHERE Numero_Voo = ?', [req.body.Duracao, req.params.Numero_Voo])
    let theFlights = await queryDB("SELECT * FROM voo");
    res.json(theFlights);
})
module.exports = router;