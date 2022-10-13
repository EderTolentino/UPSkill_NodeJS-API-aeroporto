const {queryDB} = require("./connection");

async function trocarSigla(object){
    let cidades = await queryDB("SELECT Sigla_Aeroporto, Cidade FROM aeroporto");
    object.forEach(bilhete => {
        cidades.forEach(cidade => {
            if(bilhete.Origem === cidade.Sigla_Aeroporto)
                bilhete.Origem = cidade.Cidade;
            if(bilhete.Destino === cidade.Sigla_Aeroporto)
                bilhete.Destino = cidade.Cidade;
        })
    })
}

module.exports = trocarSigla;