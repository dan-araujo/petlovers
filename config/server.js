// IMPORTANDO A BIBLIOTECA EXPRESS
const express = require('express');
// IMPORTANDO A BIBLIOTECA CONSIGN
const consign = require('consign');
// IMPORTANDO A BIBLIOTECA BODY-PARSER
const bodyParser = require('body-parser');
// IMPORTANDO O MÓDULO DO EXPRESS-SESSION
const expressSession = require('express-session');
// CRIANDO UMA INSTÂNCIA (SERVIDOR) DO EXPRESS
const server = express();
// DEFININDO QUAL SERÁ O INTERPRETADOR (VIEW ENGINE) DAS VIEWS (HTML), NO CASO AQUI, SENDO O EJS
server.set('view engine', 'ejs');
// DEFININDO O DIRETÓRIO PADRÃO DAS VIEWS (HTML)
server.set('views', './app/views/pages');
// INCLUINDO O USO DA BIBLIOTECA BODY-PARSER AO SERVIDOR
server.use(bodyParser.urlencoded({extended: true}));
// DEFININDO A PASTA DOS ARQUIVOS ESTÁTICOS QUE UTILIZAREMOS NO FRONT-END (CSS/JS)
server.use(express.static('./app/public'));
// INCLUINDO O USO DO EXPRESS-SESSION
server.use(expressSession({
    // AQUI SERÁ GERADO UM ÍNDICE DE SESSÃO AUTOMATICAMENTE PELO EXPRESS-SESSION
    secret: 'bla--bla--bla--bla',
    // SE ESTIVER COMO 'TRUE' A CADA REQUEST A SESSÃO SERÁ REGRAVADA
    resave: false, 
    // SE ESTIVER COMO 'TRUE' VAI SER GERADA UMA NOVA SESSÃO A CADA REQUEST
    saveUninitialized: false
}));
// DEFININDO O AUTOLOAD DAS ROTAS PARA QUE SEJAM INICIALIZADAS JUNTO COM O SERVIDOR
consign()
    .include('app/routes')
    .into(server); // COMO FOI DEFINIDO APENAS O DIRETÓRIO, ENTÃO TODOS OS ARQUIVOS DENTRO DO DIRETÓRIO SERÃO EXECUTADOS.

// DISPONIBIIZANDO A EXPORTAÇÃO DO OBJETO 'server' JÁ CONFIGURADO NAS LINHAS ANTERIORES
module.exports = server;