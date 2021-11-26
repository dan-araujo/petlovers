// IMPORTANDO A INSTÂNCIA (OBJETO) DO SERVIDOR QUE FOI CRIADO E CONFIGURADO NO MÓDULO 'server.js'
const server = require('./config/server');

// APLICANDO UM EVENTO 'LISTEN' NA PORTA '3000' À INSTÂNCIA 'server'
server.listen(21142, () => {
    console.log('Server ON!'); 
    // AÇÃO EXECUTADA APÓS SER DISPARADO O EVENTO LISTEN, ONDE SERÁ IMPRESSO A CONFIRMAÇÃO DE QUE O SERVIDOR FOI INICIADO CORRETAMENTE
})
