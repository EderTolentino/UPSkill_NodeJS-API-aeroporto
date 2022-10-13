const trocarSigla = require("./funcoes");
const express = require("express");
const {queryDB} = require("./connection");
const Console = require("console");
const router = express.Router();
const ExcelJS = require("exceljs");


// FUNÇÃO PARA LISTAR OS BILHETES COM: NOME, APELIDO E CIDADES DE ORIGEM E DESTINO
router.get('/listar', async function (req, res) {
    let bilhetes = await queryDB("SELECT b.Numero_Bilhete, p.Nome AS 'Nome_Passageiro', p.Apelido AS 'Apelido_Passageiro', r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', b.Numero_Voo, b.Data AS 'Data_Voo', b.Hora AS 'Hora_Voo', CONCAT(b.Numero_Fila, b.Lugar) AS 'Assento', b.Tipo_Bilhete, b.Bagagem AS 'Quant_Bagagem', b.Preco FROM bilhete b, passageiro p, voo v, rota r WHERE b.Numero_Doc = p.Numero_Doc AND b.Numero_Voo = v.Numero_Voo AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(bilhetes);
    res.json(bilhetes);
});

// FUNÇÃO PARA GERAR O EXCEL DA TABELA DE BILHETES
router.get('/listar_excel', async function (req, res) {
    let bilhetes = await queryDB("SELECT b.Numero_Bilhete, p.Nome AS 'Nome_Passageiro', p.Apelido AS 'Apelido_Passageiro', r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', b.Numero_Voo, b.Data AS 'Data_Voo', b.Hora AS 'Hora_Voo', CONCAT(b.Numero_Fila, b.Lugar) AS 'Assento', b.Tipo_Bilhete, b.Bagagem AS 'Quant_Bagagem', b.Preco FROM bilhete b, passageiro p, voo v, rota r WHERE b.Numero_Doc = p.Numero_Doc AND b.Numero_Voo = v.Numero_Voo AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(bilhetes);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('bilhete');
    let colunas = [];
    for (let i in bilhetes[0]) {
        if (bilhetes[0].hasOwnProperty(i)) {
            colunas.push(i);
        }
    }
    let cabecalho = [];
    colunas.forEach((coluna) => {
        cabecalho.push({header: coluna, key: coluna});
    })
    worksheet.columns = cabecalho;
    bilhetes.forEach((dados) => {
        worksheet.addRow(dados);
    })

    let excel = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=dados_bilhetes.xlsx");
    res.send(excel);
});

// FUNÇÃO PARA DEVOLVER A LISTA DE VOOS DE UM PASSAGEIRO (DADO O SEU NÚMERO DE DOCUMENTO)
// http://localhost:3000/bilhetes/1150811/voos
router.get('/:numero_doc/voos', async function (req, res) {
    let voos_passageiro = await queryDB(`SELECT p.Nome, p.Apelido, b.Numero_Voo, b.Data, b.Hora FROM bilhete b, passageiro p WHERE b.Numero_Doc = p.Numero_Doc AND b.Numero_Doc = ?`, [req.params.numero_doc]);
    res.json(voos_passageiro);
});

// FUNÇÃO COM DADOS ESTATÍSTICOS
router.get('/estatisticas', async function (req, res) {
    // Identificar a frequência de voo de cada passageiro por forma a identificar passageiros frequentes e outros.
    let frequencia = await queryDB("SELECT p.Nome AS 'Nome_Passageiro', p.Apelido AS 'Apelido_Passageiro', COUNT(b.Numero_Bilhete) AS 'Frequencia' FROM bilhete b, passageiro p WHERE b.Numero_Doc = p.Numero_Doc GROUP BY p.Nome ORDER BY COUNT(b.Numero_Bilhete) DESC");
    // Identificar o(s) passageiro(s) com maior número de voos registados (dados uteis para programas de fidelização)
    let mais_frequente = await queryDB("SELECT p.Nome AS 'Nome_Passageiro', p.Apelido AS 'Apelido_Passageiro', COUNT(b.Numero_Bilhete) AS 'Frequencia' FROM bilhete b, passageiro p WHERE b.Numero_Doc = p.Numero_Doc GROUP BY p.Numero_Doc HAVING COUNT(b.Numero_Bilhete) >= ALL( SELECT COUNT(b.Numero_Bilhete) AS 'Frequência' FROM bilhete b, passageiro p WHERE b.Numero_Doc = p.Numero_Doc GROUP BY p.Numero_Doc)");
    // Identificar a posição dos assentos (janela ou corredor) preferida pelos passageiros
    let assento_preferido = await queryDB("SELECT ma.Posicao, COUNT(ma.Posicao) AS 'QuantBilhetes' FROM bilhete b, horario h, aviao a, modelo m, modelo_assento ma WHERE b.Numero_Voo = h.Numero_Voo AND b.Data = h.Data AND b.Hora = h.Hora AND h.Aviao_ID = a.Aviao_ID AND a.Modelo_ID = m.Modelo_ID AND m.Modelo_ID = ma.Modelo_ID AND b.Numero_Fila = ma.Numero_Fila AND b.Lugar = ma.Lugar GROUP BY ma.Posicao HAVING COUNT(ma.Posicao) >= ALL (SELECT COUNT(ma.Posicao) FROM bilhete b, horario h, aviao a, modelo m, modelo_assento ma WHERE b.Numero_Voo = h.Numero_Voo AND b.Data = h.Data AND b.Hora = h.Hora AND h.Aviao_ID = a.Aviao_ID AND a.Modelo_ID = m.Modelo_ID AND m.Modelo_ID = ma.Modelo_ID AND b.Numero_Fila = ma.Numero_Fila AND b.Lugar = ma.Lugar GROUP BY ma.Posicao)");
    // Conhecer a percentagem de bilhetes vendidos por classe: económica, executiva ou primeira classe
    let frequencia_classe = await queryDB("SELECT (SELECT COUNT(*) FROM bilhete WHERE Tipo_Bilhete = 'econ') / COUNT(*)*100 AS 'ECON', (SELECT COUNT(*) FROM bilhete WHERE Tipo_Bilhete = 'exec') / COUNT(*)*100 AS 'EXEC', (SELECT COUNT(*) FROM bilhete WHERE Tipo_Bilhete = 'prim') / COUNT(*)*100 AS 'PRIM' FROM bilhete");
    // Identificar a quantidade de passageiros por turno do dia: manhã (6:00 às 11:59h), tarde (12:00 às 18:59h) ou noite (19:00 às 5:59h).
    let frequencia_turno = await queryDB("SELECT (CASE WHEN b.Hora >= '06:00:00' AND b.Hora < '12:00:00' THEN 'Manhã' WHEN b.Hora >= '12:00:00' AND b.Hora < '19:00:00' THEN 'Tarde' WHEN b.Hora >= '19:00:00' AND b.Hora < '23:59:59' THEN 'Noite' WHEN b.Hora >= '00:00:00' AND b.Hora < '05:59:59' THEN 'Noite' END) AS 'Turno', COUNT(b.Numero_Bilhete) AS 'QuantidadeBilhetes' FROM bilhete b GROUP BY Turno");
    // Identificar a quantidade de bilhetes vendidos por dia da semana
    let frequencia_dia = await queryDB("SELECT (CASE WHEN WEEKDAY(b.Data)=0 THEN 'Segunda' WHEN WEEKDAY(b.Data)=1 THEN 'Terça' WHEN WEEKDAY(b.Data)=2 THEN 'Quarta' WHEN WEEKDAY(b.Data)=3 THEN 'Quinta' WHEN WEEKDAY(b.Data)=4 THEN 'Sexta' WHEN WEEKDAY(b.Data)=5 THEN 'Sábado' WHEN WEEKDAY(b.Data)=6 THEN 'Domingo' END) AS 'DiaDaSemana', COUNT(b.Numero_Bilhete) AS 'Quant_Bilhetes' FROM bilhete b GROUP BY WEEKDAY(b.Data)");
    // Identificar o dia da semana com maior número de bilhetes vendidos (domingo, segunda, …, sábado)
    let dia_preferido = await queryDB("SELECT (CASE WHEN WEEKDAY(b.Data)=0 THEN 'Segunda' WHEN WEEKDAY(b.Data)=1 THEN 'Terça' WHEN WEEKDAY(b.Data)=2 THEN 'Quarta' WHEN WEEKDAY(b.Data)=3 THEN 'Quinta' WHEN WEEKDAY(b.Data)=4 THEN 'Sexta' WHEN WEEKDAY(b.Data)=5 THEN 'Sábado' WHEN WEEKDAY(b.Data)=6 THEN 'Domingo' END) AS 'DiaDaSemana', COUNT(b.Numero_Bilhete) AS 'Quant_Bilhetes' FROM bilhete b GROUP BY WEEKDAY(b.Data) HAVING COUNT(b.Numero_Bilhete) >= ALL (SELECT COUNT(b.Numero_Bilhete) AS 'Quant_Bilhetes' FROM bilhete b GROUP BY (CASE WHEN WEEKDAY(b.Data)=0 THEN 'Segunda' WHEN WEEKDAY(b.Data)=1 THEN 'Terça' WHEN WEEKDAY(b.Data)=2 THEN 'Quarta' WHEN WEEKDAY(b.Data)=3 THEN 'Quinta' WHEN WEEKDAY(b.Data)=4 THEN 'Sexta' WHEN WEEKDAY(b.Data)=5 THEN 'Sábado' WHEN WEEKDAY(b.Data)=6 THEN 'Domingo' END))");
    // Calcular o número médio de bagagens por passageiro
    let media_bagagens = await queryDB("SELECT AVG(Bagagem) AS Media_Bagagens FROM bilhete");
    // Identificar o voo com o maior número de passageiros
    let voo_preferido = await queryDB("SELECT b.Numero_Voo, COUNT(*) AS 'QuantidadeVoos' FROM voo v, bilhete b WHERE v.Numero_Voo = b.Numero_Voo GROUP BY b.Numero_Voo HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM voo v, bilhete b WHERE v.Numero_Voo = b.Numero_Voo GROUP BY b.Numero_Voo)");

    res.json({
        frequencia,
        mais_frequente: mais_frequente[0],
        assento_preferido: assento_preferido[0],
        frequencia_classe: frequencia_classe[0],
        frequencia_turno,
        frequencia_dia,
        dia_preferido: dia_preferido[0],
        media_bagagens: media_bagagens[0].Media_Bagagens,
        voo_preferido: voo_preferido[0]
    });
});

// FUNÇÃO PARA CRIAR UM NOVO BILHETE (DADOS: NOME, APELIDO, VOO, DATA, HORA, NUM_FILA E LUGAR), SENDO OPCIONAL ENTRAR COM CLASSE, BAGAGEM E PRECO
router.post('/criar', async function (req, res) {
    //VERIFICAR SE O PASSAGEIRO ESTÁ CADASTADO
    let passageiro_existe = await queryDB("SELECT Nome, Apelido FROM passageiro WHERE Numero_Doc = ?", [req.body.numero_doc]);
    if(passageiro_existe.length === 0){
        res.status(400).send("Este passageiro não está cadastado!!!");
        return;
    }

    // VERIFICAR SE O VOO JÁ TEM DATA E HORA
    let voo_existe = await queryDB("SELECT datediff(Data, CURRENT_DATE) AS 'Dias', timediff(Hora, CURRENT_TIME) AS 'Horas' FROM bilhete WHERE Numero_Voo = ? AND Data = ? AND Hora = ?", [req.body.numero_voo, req.body.data, req.body.hora]);
    if (voo_existe.length === 0){
        res.status(400).send("Não há voo com esta data e hora!!!");
        return;
    }

    // VERIFICAR QUE O NOVO BILHETE SERÁ ADICIONADO EM UM VOO AINDA NÃO REALIZADO
    if(voo_existe[0].Dias < 0 && voo_existe[0].Horas[0] === '-' || voo_existe[0].Dias === 0 && voo_existe[0].Horas[0] === '-'){
        res.status(400).send("POR FAVOR, ESCOLHA UMA DATA FUTURA!!!");
        return;
    }

    // VERIFICAR SE O ASSENTO ESTÁ OCUPADO
    let assento_ocupado = await queryDB("SELECT * FROM bilhete WHERE Numero_Voo = ? AND Data = ? AND Hora = ? AND Numero_Fila = ? AND Lugar = ?", [req.body.numero_voo, req.body.data, req.body.hora, req.body.numero_fila, req.body.lugar]);
    if (assento_ocupado.length > 0) {
        assento_ocupado = await queryDB("SELECT CONCAT(Numero_Fila, Lugar) AS 'Assento' FROM bilhete WHERE Numero_Voo = ? AND Data = ? AND Hora = ? ORDER BY Numero_Voo AND Data", [req.body.numero_voo, req.body.data, req.body.hora]);
        let assentos_modelo = await queryDB("SELECT CONCAT(ma.Numero_Fila, ma.Lugar) AS 'Assento' FROM modelo_assento ma WHERE ma.Modelo_ID = (SELECT ma.Modelo_ID FROM bilhete b, horario h, aviao a, modelo m, modelo_assento ma WHERE b.Numero_Voo = h.Numero_Voo AND h.Aviao_ID = a.Aviao_ID AND a.Modelo_ID = m.Modelo_ID AND m.Modelo_ID = ma.Modelo_ID AND b.Numero_Voo = ? AND b.Data = ? AND b.Hora = ? GROUP BY ma.Modelo_ID)", [req.body.numero_voo, req.body.data, req.body.hora]);
        let ocupados = [];
        let todos = [];
        assento_ocupado.forEach(lugares => {
            ocupados.push(lugares.Assento);
        })
        assentos_modelo.forEach(lugares => {
            todos.push(lugares.Assento);
        })
        let livres = todos.filter(lugar => !ocupados.includes(lugar));
        if (livres.length === 0) {
            res.status(400).send("O voo está cheio!!!");
            return;
        } else {
            res.status(400).send({
                mensagem: "O assento selecionado já está ocupado!!!",
                lugares_livres: livres
            });
            return;
        }
    }
    let passageiro_voo = await queryDB("SELECT * FROM bilhete WHERE Numero_Doc = ? AND Numero_Voo = ? AND Data = ? AND Hora = ?", [req.body.numero_doc, req.body.numero_voo, req.body.data, req.body.hora]);

    // VERIFICAR SE O PASSAGEIRO ESTÁ NO VOO ESCOLHIDO
    if (passageiro_voo.length > 0) {
        res.status(400).send("Este passageiro já está neste voo");
        return;
    }
    // SE PASSAR POR TODAS AS CONFERÊNCIAS, FAZ-SE A CRIAÇÃO DO BILHETE
    await queryDB("INSERT INTO bilhete SET ?", {
        Numero_Doc: req.body.numero_doc,
        Numero_Voo: req.body.numero_voo,
        Data: req.body.data,
        Hora: req.body.hora,
        Numero_Fila: req.body.numero_fila,
        Lugar: req.body.lugar,
        Tipo_Bilhete: req.body.tipo_bilhete,
        Bagagem: req.body.bagagem,
        Preco: req.body.preco,
    });
    let bilhetes = await queryDB("select * from bilhete");
    res.json(bilhetes);
});

// FUNÇÃO PARA DELETAR UM BILHETE (DADO O SEU ID) E RETORNAR A NOVA LISTA DE BILHETES
router.post('/:numero_bilhete/apagar', async function (req, res) {
    let bilhete = await queryDB("SELECT * FROM bilhete  WHERE Numero_Bilhete = ?", [req.params.numero_bilhete]);
    if (bilhete.length === 0) {
        res.status(400).send("ESTE BILHETE NÃO EXISTE!!!");
        return;
    }

    // VERIFICAR SE A DATA DO BILHETE JÁ PASSOU
    let data_diff = await queryDB("SELECT datediff(Data, CURRENT_DATE) AS 'Dias', timediff(Hora, CURRENT_TIME) AS 'Horas' FROM bilhete WHERE Numero_Bilhete = ?", [req.params.numero_bilhete]);
    if(data_diff[0].Dias < 0 || data_diff[0].Dias === 0 && data_diff[0].Horas[0] === '-'){
        res.status(400).send("ESTE BILHETE É DE UMA DATA PASSADA E NÃO PODE MAIS SER APAGADO!!!");
        return;
    }

    await queryDB("DELETE FROM bilhete WHERE Numero_Bilhete = ?", [req.params.numero_bilhete]);
    let bilhetes = await queryDB("SELECT b.Numero_Bilhete, p.Nome, p.Apelido, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', b.Numero_Voo, b.Data, b.Hora, b.Numero_Fila, b.Lugar, b.Tipo_Bilhete, b.Bagagem, b.Preco FROM bilhete b, passageiro p, voo v, rota r WHERE b.Numero_Doc = p.Numero_Doc AND b.Numero_Voo = v.Numero_Voo AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(bilhetes);
    res.json(bilhetes);
});

// FUNÇÃO PARA EDITAR OS ASSENTOS DE UM BILHETE (DADO O SEU ID) E RETORNAR A NOVA LISTA DE BILHETES
router.post('/:numero_bilhete/editar', async function (req, res) {
    // VERIFICAR SE O BILHETE EXISTE E, CASO EXISTA, GUARDAR OS DADOS DO VOO
    let dados_voo = await queryDB("SELECT Numero_Voo, Data, Hora FROM bilhete WHERE Numero_Bilhete = ?", [req.params.numero_bilhete]);
    if (dados_voo.length === 0) {
        res.status(400).send("ESTE BILHETE NÃO EXISTE!!!");
        return;
    }

    // VERIFICAR SE A DATA DO BILHETE JÁ PASSOU
    let data_diff = await queryDB("SELECT datediff(Data, CURRENT_DATE) AS 'Dias', timediff(Hora, CURRENT_TIME) AS 'Horas' FROM bilhete WHERE Numero_Bilhete = ?", [req.params.numero_bilhete]);
    if(data_diff[0].Dias < 0 || data_diff[0].Dias === 0 && data_diff[0].Horas[0] === '-'){
        res.status(400).send("ESTE BILHETE É DE UMA DATA PASSADA E NÃO PODE MAIS SER EDITADO!!!");
        return;
    }

    // VERIFICAR SE O ASSENTO ESTÁ OCUPADO
    let assento_ocupado = await queryDB("SELECT * FROM bilhete WHERE Numero_Voo = ? AND Data = ? AND Hora = ? AND Numero_Fila = ? AND Lugar = ?", [dados_voo[0].Numero_Voo, dados_voo[0].Data, dados_voo[0].Hora, req.body.numero_fila, req.body.lugar]);
    if (assento_ocupado.length > 0) {
        assento_ocupado = await queryDB("SELECT CONCAT(Numero_Fila, Lugar) AS 'Assento' FROM bilhete WHERE Numero_Voo = ? AND Data = ? AND Hora = ? ORDER BY Numero_Voo AND Data", [dados_voo[0].Numero_Voo, dados_voo[0].Data, dados_voo[0].Hora]);
        let assentos_modelo = await queryDB("SELECT CONCAT(ma.Numero_Fila, ma.Lugar) AS 'Assento' FROM modelo_assento ma WHERE ma.Modelo_ID = (SELECT ma.Modelo_ID FROM bilhete b, horario h, aviao a, modelo m, modelo_assento ma WHERE b.Numero_Voo = h.Numero_Voo AND h.Aviao_ID = a.Aviao_ID AND a.Modelo_ID = m.Modelo_ID AND m.Modelo_ID = ma.Modelo_ID AND b.Numero_Voo = ? AND b.Data = ? AND b.Hora = ? GROUP BY ma.Modelo_ID)", [dados_voo[0].Numero_Voo, dados_voo[0].Data, dados_voo[0].Hora]);
        let ocupados = [];
        let todos = [];
        assento_ocupado.forEach(lugares => {
            ocupados.push(lugares.Assento);
        })
        assentos_modelo.forEach(lugares => {
            todos.push(lugares.Assento);
        })
        let livres = todos.filter(lugar => !ocupados.includes(lugar));
        if (livres.length === 0) {
            res.status(400).send("O voo está cheio!!!");
            return;
        } else {
            res.status(400).send({
                mensagem: "O assento selecionado já está ocupado!!!",
                lugares_livres: livres
            });
            return;
        }
    }
    await queryDB("UPDATE bilhete SET Numero_Fila = ?, Lugar = ? WHERE Numero_Bilhete = ?", [req.body.numero_fila, req.body.lugar, req.params.numero_bilhete]);
    let bilhetes = await queryDB("SELECT b.Numero_Bilhete, p.Nome, p.Apelido, r.Sigla_Aeroporto_Origem AS 'Origem', r.Sigla_Aeroporto_Destino AS 'Destino', b.Numero_Voo, b.Data, b.Hora, b.Numero_Fila, b.Lugar, b.Tipo_Bilhete, b.Bagagem, b.Preco FROM bilhete b, passageiro p, voo v, rota r WHERE b.Numero_Doc = p.Numero_Doc AND b.Numero_Voo = v.Numero_Voo AND v.Rota_ID = r.Rota_ID");
    await trocarSigla(bilhetes);
    res.json(bilhetes);
});
module.exports = router;

