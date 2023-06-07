
import express from "express";
import axios from "axios";

const app = express();



import IntegracaoController from "./src/controllers/IntegracaoController.js";


// Configurando módulo ejs e a chamada das views
app.set("view engine", "ejs");
app.set('views', './src/views');
app.use("/static", express.static("public"));


// Configuração da recepção de dados pelo form
app.use(express.urlencoded({ extended: false })); // Extrair dados do formulário e adicionar ao body
app.use(express.json());




// Rotas 
app.get('/',  IntegracaoController.index)
app.get('/api',  IntegracaoController.consultaDocumentos)
app.get('/teste',  IntegracaoController.trataDados)
app.get('/auth',  IntegracaoController.autenticacao)


app.listen(3000, () => console.log("Servidor instalado e funcionando"));