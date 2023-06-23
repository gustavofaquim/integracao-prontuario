import axios from "axios";

class IntegracaoController{

    constructor() {
        this.autenticacao = this.autenticacao.bind(this);
        this.consultaDocumentos = this.consultaDocumentos.bind(this);
        this.trataDados = this.trataDados.bind(this);
    }
 
    index (req,res){
        res.render("inicio.ejs");
    }

    autenticacao(){

        return new Promise((resolve, reject) => {

             // const user = autenticacao.user;
            // const pass = autenticacao.password;

            const user = "gustavo.faquim";
            const pass = "wtf@13Zy";
            

            // URL e cabeçalhos
            const url = "https://documents.abaris.com.br/api/v1/login/";


            const headers = {
                'Custom-Origin': 'aee.abaris.com.br',
                'Content-Type': 'application/json'
            }; 


            // Corpo da solicitação POST
            const data = {
                userName: 'gustavo.faquim',
                password: 'wtf@13Zy'
            };

            // Fazer a requisição POST usando Axios
            axios.post(url, data, { headers })
            .then(response => {
                //console.log(response.data);
                const key = response.data;
                resolve(key);
                //res.status(200).json({success: [{msg:  key}]})
            })
            .catch(error => {
                console.error(error);
                reject(error);
                //res.status(500).json({errors: [{msg: 'Error.'}]})
            });
        })

    }

    
    async consultaDocumentos(){

        try{

            const url = 'https://documents.abaris.com.br/api/v1/document/advanced-search';

            const key = await this.autenticacao()
            //console.log(key)    

            let auth = '---------------------'

            if(key.rsaKey){
                auth = key.rsaKey
            }
            console.log(auth)

            const headers = {
                "x-api-key": auth,
                "Content-Type": "application/json"
            }; 

            
           /* const tipoDoc = [
                'CPF', 'EXTENSAO', 'CARTEIRA DE IDENTIDADE', 'CERTIDÃO DE CASAMENTO', 
                'CERTIDÃO DE NASCIMENTO', 'CERTIFICADO ENSINO MÉDIO', 
                'DOCUMENTO MILITAR', 'HISTÓRICO ESCOLAR',
                'TERMO DE RESPONSABILIDADE', 'TÍTULO ELEITOR'
            ]*/

            const idsTiposDoc = [79,85,84,80,88,95,81,78,86]

            //console.log(tipoDoc)

            let tipoIndice = '125.43 - GRADUAÇÃO'
            const indice = [];

            const novoElemento = {
                "nome": "CODIGO SIGA",
                "operador": "=",
                "valor": tipoIndice
            };

            indice.push(novoElemento);
            
            const post = {
                "ids_tipodocumento": idsTiposDoc,
                //"nomes_tipodocumento": tipoDoc,
                "resultados_pagina": 15000,
                "resultado_inicial": 0,
                "dataDe": "2023-06-01",
                "indiceBusca": indice
            };
            

            // Fazer a requisição POST usando Axios
            /*axios.post(url, post, {headers})
            .then(response => {
                console.log('Deu certo')
                console.log(response.data.documentos);
                //res.status(200).json(response.data.documentos)  
                return response.data.documentos;              
            })
            .catch(error => {
                console.error(error);
                return error
                //res.status(500).json({errors: [{msg: 'Error.' + ' ' + error}]})
            });*/
            return new Promise((resolve, reject) => {
                // Fazer a requisição POST usando Axios
                axios.post(url, post, { headers })
                  .then(response => {
                    console.log('Deu certo');
                    //console.log(response.data.documentos);
                    resolve(response.data.documentos);
                  })
                  .catch(error => {
                    console.error(error);
                    reject(error);
                  });
              });

        }catch (error) {
            console.error('Erro na autenticação:', error);
        }
    }

    async dadosAluno(matricula){

        try{
        
            const url = `http://172.16.16.37:8080/api/matricula/codAluno/${matricula}/obterAluno`;

            const headers = {
                'Authorization': 'Basic YXBpdXNlcjphcGl1c2VyQDEyMw==',
                "Content-Type": "application/json"
            }

            return new Promise((resolve, reject) => {
                // Fazer a requisição POST usando Axios
                axios.post(url, null, { headers })
                .then(response => {
                    console.log('API do Lyceum');
                    console.log(response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
            });

        }catch(error){
            console.error('Erro na API do Lyceum:', error);
        }
    }

    async trataDados(){
        
        try{
            const dados = await this.consultaDocumentos()
            console.log('Entrou no tratamento de dados')
            
            dados.forEach(e => {
                //console.log(e)
                //console.log('---------------');

                let id_doc;

                switch(e.nomeTipoDocumento){
                    case 'CPF':
                        id_doc = 43;
                        break;
                    case 'HISTÓRICO ESCOLAR':
                        id_doc = 46;
                        break; 
                    case 'CERTIDÃO CASAMENTO':
                        id_doc = 48;
                        break;
                    case 'CERTIDÃO NASCIMENTO':
                        id_doc = 47;
                        break; 
                    case 'TÍTULO ELEITOR':
                        id_doc = 49;
                        break;  
                    case 'CARTEIRA IDENTIDADE':
                        id_doc = 44;
                        break;   
                    case 'TERMO RESPONSABILIDADE':
                        id_doc = 50;
                        break; 
                    case 'DOCUMENTO MILITAR':
                        id_doc = 51;
                        break; 
                }

                let matricula = e.documentoIndice[3].valor;

                const pessoa =  this.dadosAluno(matricula).pessoa;
                

                const documentosPessoais = {
                    ID_DOCUMENTO : id_doc,
                    PESSOA: pessoa,
                    MATRICULA: matricula,

                }
            });

            
            
            
            return dados
            
        }catch(error){
            console.log("Erro no tratamento de dados: ", error)
            throw error;
        }
        
    }

}

// padrão Singleton
export default new IntegracaoController()