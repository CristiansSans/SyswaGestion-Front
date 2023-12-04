const serverL = 'localhost:3200'
const server = '18.228.199.97:4200'
const portClient = '3389'
const endpointTarget = `http://${server}`
const imgEndpoint = `${endpointTarget}/static/users/`

const dataPuentealto = {
    imgEndpoint: imgEndpoint, 
    portClient: portClient, 
    database: 'mpuentealto-syswa',
    siteRedirect: "https://www.mpuentealto.cl",
    endpointTarget: endpointTarget,
    url: `http://mpuentealto.syswa.net/#`,
    server: server,
    title: "Municipalidad de Puente Alto"
}

const dataKK = {
    imgEndpoint: imgEndpoint, 
    portClient:portClient, 
    database: 'kkprettynails-syswa',
    siteRedirect: 'http://kkspa.cl',
    endpointTarget:endpointTarget,
    url: `http://kkspa.syswa.net/#`,
    server:server,
    title: "KKSPA"
}

const dataQa = {
    imgEndpoint: imgEndpoint, 
    portClient:portClient, 
    database: "syswa-gestion-qa",
    siteRedirect: "",
    endpointTarget:endpointTarget,
    url: `http://syswagestionqa.syswa.net/#`,
    server:server,
    title: "Syswa gestion"
}

const endPoint = dataKK

module.exports = endPoint