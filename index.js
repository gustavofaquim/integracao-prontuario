
import express from "express";
import axios from "axios";



const app = express();

import IntegracaoController from "./src/controllers/IntegracaoController.js";
import Conexao from "./src/connections/Conexao.js";
import AlunoController from "./src/controllers/AlunoController.js";
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
app.get('/api',  IntegracaoController.consultaDocumentos)
//app.get('/teste',  IntegracaoController.trataDados)
app.get('/teste', async (req, res) => {
    try {
      const dados = await IntegracaoController.inserirDados();
      res.send(`Dados tratados com sucesso`);
    } catch (error) {
      console.error('Erro no tratamento de dados:', error);
      res.status(500).send('Ocorreu um erro no tratamento de dados');
    }
});

app.get('/auth',  IntegracaoController.autenticacao)

app.get('/aluno',  AlunoController.listarAluno)
app.get('/listar-documentos', DocumentosPesssoaDAO.listarDocumentos);


app.listen(3000, () => console.log("Servidor instalado e funcionando"));