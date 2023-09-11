
import express from "express";
import axios from "axios";



const app = express();

import IntegracaoController from "./src/controllers/IntegracaoController.js";
import Conexao from "./src/connections/Conexao.js";

import DocumentosPesssoaDAO from "./src/connections/DocumentosPesssoaDAO.js";



// Configurando módulo ejs e a chamada das views
app.set("view engine", "ejs");
app.set('views', './src/views');
app.use("/static", express.static("public"));


// Configuração da recepção de dados pelo form
app.use(express.urlencoded({ extended: false })); // Extrair dados do formulário e adicionar ao body
app.use(express.json());




// Rotas 
app.get('/',  IntegracaoController.index)
app.get('/consultaDocumentos',  IntegracaoController.consultaDocumentos)
app.get('/consultaLogs', IntegracaoController.consultaLogs)
app.get('/api', async (req, res) => {
    try {
      const dados = await IntegracaoController.inserirDados();
      res.status(200).json({success: [{msg:  'Sucesso ao sincronizar os documentos'}]})
    } catch (error) {
      res.status(200).json({error: [{msg:  'Ocorreu um erro no tratamento de dados'}]})
    }
});

app.get('/auth',  IntegracaoController.autenticacao)

app.get('/listar-documentos', DocumentosPesssoaDAO.listarDocumentos);


app.listen(3000, () => console.log("Servidor instalado e funcionando"));