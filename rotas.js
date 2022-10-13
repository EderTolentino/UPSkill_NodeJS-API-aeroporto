const trocarSigla = require("./funcoes");
const express = require("express");
const {queryDB} = require("./connection");
const ExcelJS = require("exceljs");
const router = express.Router();

// Indicar quais são as companhias que operam uma determinada rota (dado o id desta rota)
router.get('/:rota_id/companhias', async function (req, res) {
    let rota_companhias = await queryDB("SELECT v.Sigla_Companhia, ca.Nome_Companhia FROM rota r, voo v, companhia_aerea ca WHERE r.Rota_ID = v.Rota_ID AND v.Sigla_Companhia = ca.Sigla_Companhia AND r.Rota_ID = ? ORDER BY r.Rota_ID", [req.params.rota_id]);
    res.json(rota_companhias);
});

router.get('/estatisticas', async function (req, res) {
    //  Visualizar a quantidade de companhias aéreas a operar cada Rota, da mais operada para a menos
    let companhias_rota = await queryDB("SELECT r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', COUNT(v.Sigla_Companhia) AS 'CompanhiasAéreas' FROM voo v, rota r WHERE v.Rota_ID = r.Rota_ID GROUP BY v.Rota_ID ORDER BY COUNT(v.Sigla_Companhia) DESC");
    // Indicar o total de rotas associadas para cada companhia aérea
    let rotas_companhia = await queryDB("SELECT ca.Nome_Companhia, COUNT(v.Rota_ID) AS 'RotasEfetuadas' FROM voo v, companhia_aerea ca WHERE v.Sigla_Companhia = ca.Sigla_Companhia GROUP BY v.Sigla_Companhia UNION SELECT ca.Nome_Companhia, 0 FROM companhia_aerea ca WHERE ca.Sigla_Companhia NOT IN (SELECT Sigla_Companhia FROM voo)");
    res.json({
        companhias_rota,
        rotas_companhia
    });
});



router.get('/listar', async function (req, res) {
    let rotas = await queryDB("SELECT Rota_ID, Sigla_Aeroporto_Origem AS 'Origem', Sigla_Aeroporto_Destino AS 'Destino' FROM rota");
    await trocarSigla(rotas);
    res.json(rotas);
});

// FUNÇÃO PARA GERAR O EXCEL DA TABELA DE rotas
router.get('/listar_excel', async function (req, res) {
    let rotas = await queryDB("SELECT Rota_ID, Sigla_Aeroporto_Origem AS 'Origem', Sigla_Aeroporto_Destino AS 'Destino' FROM rota");
    await trocarSigla(rotas);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('rota');
    let colunas = [];
    for (let i in rotas[0]) {
        if (rotas[0].hasOwnProperty(i)) {
            colunas.push(i);
        }
    }
    let cabecalho = [];
    colunas.forEach((coluna) => {
        cabecalho.push({header: coluna, key: coluna});
    })
    worksheet.columns = cabecalho;
    rotas.forEach((dados) => {
        worksheet.addRow(dados);
    })

    let excel = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=dados_rotas.xlsx");
    res.send(excel);
});

// FUNÇÃO PARA CRIAR UM NOVO BILHETE (DADOS: NOME, APELIDO, VOO, DATA, HORA, NUM_FILA E LUGAR), SENDO OPCIONAL ENTRAR COM CLASSE, BAGAGEM E PRECO
router.post('/criar', async function (req, res) {
    // Conferir se os aeroportos de Origem e Destino já estão cadastrados -
    let rota_id = '';
    let cidades = await queryDB("SELECT Sigla_Aeroporto, Cidade FROM aeroporto");

    cidades.forEach(cidade => {
        if(req.body.sigla_aeroporto_origem == cidade.Sigla_Aeroporto)
            rota_id = req.body.sigla_aeroporto_origem;
    })
    if(rota_id.length === 0){
        res.status(400).send("O aeroporto de origem não existe!!!");
        return;
    }
    cidades.forEach(cidade => {
        if(req.body.sigla_aeroporto_destino === cidade.Sigla_Aeroporto)
            rota_id = rota_id + '-' + req.body.sigla_aeroporto_destino;
    })
    if(rota_id.length === 3){
        res.status(400).send("O aeroporto de destino não existe!!!");
        return;
    }
    let rotas = await queryDB("SELECT * FROM rota WHERE Rota_ID = ?", [rota_id]);
    if (rotas.length > 0){
        res.status(400).send("ESTA ROTA JÁ EXISTE!!!");
        return;
    }
    else{
        await queryDB("INSERT INTO rota SET ?", {
            Rota_ID: rota_id,
            Sigla_Aeroporto_Origem: req.body.sigla_aeroporto_origem,
            Sigla_Aeroporto_Destino: req.body.sigla_aeroporto_destino,
        });
    }

    let rotas_atualizadas = await queryDB("SELECT Rota_ID, Sigla_Aeroporto_Origem AS 'Origem', Sigla_Aeroporto_Destino AS 'Destino' FROM rota");

    rotas_atualizadas.forEach(rota => {
        cidades.forEach(cidade => {
            if(rota.Origem === cidade.Sigla_Aeroporto)
                rota.Origem = cidade.Cidade;
            if(rota.Destino === cidade.Sigla_Aeroporto)
                rota.Destino = cidade.Cidade;
        })
    })
    res.json(rotas_atualizadas);
});

// FUNÇÃO PARA CRIAR UM NOVO BILHETE (DADOS: NOME, APELIDO, VOO, DATA, HORA, NUM_FILA E LUGAR), SENDO OPCIONAL ENTRAR COM CLASSE, BAGAGEM E PRECO
router.post('/:rota_id/apagar', async function (req, res) {
    let rota_existe = await queryDB("SELECT * FROM rota WHERE Rota_ID = ?", [req.params.rota_id]);
    if(rota_existe.length === 0){
        res.status(400).send("ESTA ROTA NÃO EXISTE");
        return;
    }
    let rota_usada = await queryDB("SELECT * FROM voo WHERE Rota_ID = ?", [req.params.rota_id]);
    if(rota_usada.length > 0){
        res.status(400).send("ESTA ROTA JÁ TEM VOOS ASSOCIADOS E NÃO PODE SER APAGADA");
        return;
    }

    await queryDB("DELETE FROM rota WHERE Rota_ID = ?", [req.params.rota_id]);
    let cidades = await queryDB("SELECT Sigla_Aeroporto, Cidade FROM aeroporto");
    let rotas_atualizadas = await queryDB("SELECT Rota_ID, Sigla_Aeroporto_Origem AS 'Origem', Sigla_Aeroporto_Destino AS 'Destino' FROM rota");
    rotas_atualizadas.forEach(rota => {
        cidades.forEach(cidade => {
            if(rota.Origem === cidade.Sigla_Aeroporto)
                rota.Origem = cidade.Cidade;
            if(rota.Destino === cidade.Sigla_Aeroporto)
                rota.Destino = cidade.Cidade;
        })
    })
    res.json(rotas_atualizadas);
});



module.exports = router;