const trocarSigla = require("./funcoes");
const express = require("express");
const {queryDB} = require("./connection");
const ExcelJS = require("exceljs");
const router = express.Router();

router.get('/listar', async function (req, res) {
    let avioes = await queryDB("SELECT a.Aviao_ID, m.Codigo_Modelo AS 'Modelo', a.Sigla_Companhia, c.Nome_Companhia, a.Nome_Aviao, m.Capacidade FROM aviao a, modelo m, companhia_aerea c WHERE a.Modelo_ID = m.Modelo_ID AND a.Sigla_Companhia = c.Sigla_Companhia");
    res.json(avioes);
});

router.get('/listar_excel', async function (req, res) {
    let avioes = await queryDB("SELECT a.Aviao_ID, m.Codigo_Modelo AS 'Modelo', a.Sigla_Companhia, c.Nome_Companhia, a.Nome_Aviao, m.Capacidade FROM aviao a, modelo m, companhia_aerea c WHERE a.Modelo_ID = m.Modelo_ID AND a.Sigla_Companhia = c.Sigla_Companhia");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('aviao');
    let colunas = [];
    for (let i in avioes[0]) {
        if (avioes[0].hasOwnProperty(i)) {
            colunas.push(i);
        }
    }
    let cabecalho = [];
    colunas.forEach((coluna) => {
        cabecalho.push({header: coluna, key: coluna});
    })
    worksheet.columns = cabecalho;
    avioes.forEach((dados) => {
        worksheet.addRow(dados);
    })

    let excel = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=lista_avioes.xlsx");
    res.send(excel);
});

router.get('/:aviao_id/voos', async function (req, res) {
    let voos_avioes = await queryDB("SELECT h.Numero_Voo, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', h.Data AS 'Data_Voo', h.Hora AS 'Hora_Voo' FROM aviao a, horario h, voo v, rota r WHERE a.Aviao_ID = h.Aviao_ID AND h.Numero_Voo = v.Numero_Voo AND v.Rota_ID = r.Rota_ID AND a.Aviao_ID = ?", [req.params.aviao_id]);
    await trocarSigla(voos_avioes);
    res.json(voos_avioes);
});

router.get('/estatistica', async function (req, res) {
    let horas_de_voos = await queryDB("SELECT a.Aviao_ID, CAST(SUM(v.Duracao) AS TIME) AS 'Horas de Voo' FROM aviao a, horario h, voo v WHERE a.Aviao_ID = h.Aviao_ID AND h.Numero_Voo = v.Numero_Voo GROUP BY a.Aviao_ID");
    res.json(horas_de_voos);
});

router.post('/criar', async function(req, res){
    let aviao_existe = await queryDB("SELECT * FROM aviao WHERE Modelo_ID = ? AND Sigla_Companhia = ? AND Nome_Aviao = ?", [req.body.modelo_id, req.body.sigla_companhia, req.body.nome_aviao]);
    if(aviao_existe.length > 0){
        res.status(400).send("Este avião já está registado na BD!!!");
        return;
    }
    let companhia_existe = await queryDB("SELECT Sigla_Companhia FROM companhia_aerea WHERE Sigla_Companhia = ?", [req.body.sigla_companhia]);
    if(companhia_existe.length === 0){
        res.status(400).send("Esta companhia não existe!!!");
        return;
    }
    let modelo_existe = await queryDB("SELECT Modelo_ID FROM modelo WHERE Modelo_ID = ?", [req.body.modelo_id]);
    if(modelo_existe.length === 0){
        res.status(400).send("Este modelo de avião não existe!!!");
        return;
    }
    await queryDB("INSERT INTO aviao SET ?", {
        Modelo_ID: req.body.modelo_id,
        Sigla_Companhia: req.body.sigla_companhia,
        Nome_Aviao: req.body.nome_aviao
    })
    let avioes = await queryDB("SELECT a.Aviao_ID, a.Modelo_ID, a.Sigla_Companhia, c.Nome_Companhia, a.Nome_Aviao, m.Capacidade FROM aviao a, modelo m, companhia_aerea c WHERE a.Modelo_ID = m.Modelo_ID AND a.Sigla_Companhia = c.Sigla_Companhia");
    res.json(avioes);
})

router.post('/:aviao_id/editar', async function (req, res) {
    let aviao_existe = await queryDB("SELECT * FROM aviao WHERE Aviao_ID = ?", [req.params.aviao_id]);

    if(aviao_existe.length === 0){
        res.status(400).send('Este aviao não existe!!!');
        return;
    } else {
        await queryDB("UPDATE aviao SET Nome_Aviao = ? WHERE Aviao_ID = ?", [req.body.nome_aviao, req.params.aviao_id]);
        let avioes = await queryDB("SELECT a.Aviao_ID, a.Modelo_ID, a.Sigla_Companhia, c.Nome_Companhia, a.Nome_Aviao, m.Capacidade FROM aviao a, modelo m, companhia_aerea c WHERE a.Modelo_ID = m.Modelo_ID AND a.Sigla_Companhia = c.Sigla_Companhia");
        res.json(avioes);
    }
});

router.post('/:aviao_id/apagar', async function (req, res) {
    let aviao_existe = await queryDB("SELECT * FROM aviao WHERE Aviao_ID = ?", [req.params.aviao_id]);
    if(aviao_existe.length === 0){
        res.status(400).send('ESTE AVIÃO NÃO EXISTE!!!');
        return;
    }
    let aviao_usado = await queryDB("SELECT * FROM horario WHERE Aviao_ID = ?", [req.params.aviao_id]);
    if(aviao_usado.length > 0){
        res.status(400).send('ESTE AVIÃO JÁ TEM VOOS ASSOCIADOS E NÃO PODE SER APAGADO!!!');
        return;
    }

    await queryDB("DELETE FROM aviao WHERE Aviao_ID = ?", [req.params.aviao_id]);
    let avioes = await queryDB("SELECT a.Aviao_ID, a.Modelo_ID, a.Sigla_Companhia, c.Nome_Companhia, a.Nome_Aviao, m.Capacidade FROM aviao a, modelo m, companhia_aerea c WHERE a.Modelo_ID = m.Modelo_ID AND a.Sigla_Companhia = c.Sigla_Companhia");
    res.json(avioes);
});

module.exports = router;