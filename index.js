const API = require('./api/api');
const Entity = require('./api/entity');

const config = require('./env');

let api = new API(`${config.protocolDomainPort}/sap/opu/odata/sap/YY1_APROVADORES_WF_REQ_CDS`, config.user, config.password);
let entity = new Entity(api, 'YY1_APROVADORES_WF_REQ');

var csvFile = process.argv.slice(2)[0];
const csv=require('csvtojson');

async function saveConfig(wfConfigEntry){

    try {

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
                Aprovador: wfConfigEntry.Aprovador,
            };
            await entity.patch(results[0].__metadata.uri, body);
        }

        console.info(`Registro ${wfConfigEntry.TipoAgrupacao}/${wfConfigEntry.ValorAgrupao}/`+
            `${wfConfigEntry.NivelAprovacao}/${wfConfigEntry.Aprovador} criado/atualizado com sucesso.`);
            
    } catch (error) {
        console.error(JSON.stringify(error));
    }

}

csv({delimiter: 'auto'})
.fromFile(csvFile)
.then(async (wfConfig) =>{
    for (wfConfigEntry of wfConfig){
        saveConfig(wfConfigEntry);
    }
}
)