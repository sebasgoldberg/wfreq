const fs = require('fs');
const API = require('./api/api');
const Entity = require('./api/entity');

let params = process.argv.slice(2);
var envName = params[0];
var csvFile = params[1];
var usersJSONFile = params[2];

const config = require('./env')[envName];

let api = new API(`${config.protocolDomainPort}/sap/opu/odata/sap/YY1_APROVADORES_WF_REQ_CDS`, config.user, config.password);
let entity = new Entity(api, 'YY1_APROVADORES_WF_REQ');


const csv=require('csvtojson');

async function saveConfig(wfConfigEntry, emailToUserID){

    try {

        let Aprovador = emailToUserID ? emailToUserID[wfConfigEntry.Aprovador] : wfConfigEntry.Aprovador;
        if (!Aprovador)
            throw `Aprovador não encontrado para ${wfConfigEntry.Aprovador}`;

        let results = await entity.get({
            '$filter': `TipoAgrupacao eq '${wfConfigEntry.TipoAgrupacao}'`+
            ` and ValorAgrupao eq '${wfConfigEntry.ValorAgrupao}'`+
            ` and NivelAprovacao eq '${wfConfigEntry.NivelAprovacao}'`
        });

        if (results.length == 0){
            await entity.post(wfConfigEntry);
        }
        else{
            let body = {
                Aprovador: Aprovador,
            };
            await entity.patch(results[0].__metadata.uri, body);
        }

        console.info(`Registro ${wfConfigEntry.TipoAgrupacao}/${wfConfigEntry.ValorAgrupao}/`+
            `${wfConfigEntry.NivelAprovacao}/${Aprovador} criado/atualizado com sucesso.`);
            
    } catch (error) {
        console.error(JSON.stringify(error));
    }

}

csv({delimiter: 'auto'})
.fromFile(csvFile)
.then(async (wfConfig) =>{

    let emailToUserID;
    if (usersJSONFile){
        emailToUserID = JSON.parse(fs.readFileSync(usersJSONFile));
    }
        

    for (wfConfigEntry of wfConfig){
        saveConfig(wfConfigEntry, emailToUserID);
    }
}
)