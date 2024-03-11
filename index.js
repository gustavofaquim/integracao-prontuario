
import express from "express";


const app = express();

import autenticarUsuario from "./src/controllers/autenticarUsuario.js";
import consultaDocumentos from "./src/controllers/consultaDocumentos.js";

import homeController from "./src/controllers/homeController.js";



// Configurando módulo ejs e a chamada das views
app.set("view engine", "ejs");
app.set('views', './src/views');
app.use("/static", express.static("public"));


// Configuração da recepção de dados pelo form
app.use(express.urlencoded({ extended: false })); // Extrair dados do formulário e adicionar ao body
app.use(express.json());




// Novas Implementações
//Rotas
app.get('/',  homeController.index)
app.get('/autenticar', autenticarUsuario.autenticarAbaris);
app.get("/prepara", consultaDocumentos.preparaInsercao);
app.get('/consulta-docs', consultaDocumentos.listarTodos);
app.get('/insere', consultaDocumentos.insereDocumentos);



app.listen(3000, () => console.log("Servidor instalado e funcionando"));