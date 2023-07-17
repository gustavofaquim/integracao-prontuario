import axios from "axios";
import DocumentosPesssoaDAO from "../connections/DocumentosPesssoaDAO.js";

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


            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Os meses são indexados de 0 a 11
            const dia = dataAtual.getDate().toString().padStart(2, '0');
            const horas = dataAtual.getHours().toString().padStart(2, '0');
            const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
            const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
            const milissegundos = dataAtual.getMilliseconds().toString().padStart(3, '0');
            
            const dataAtualFormatada = `${ano}-${mes}-${dia}`;
            console.log(dataAtualFormatada);

            
            const post = {
                "ids_tipodocumento": idsTiposDoc,
                //"nomes_tipodocumento": tipoDoc,
                "resultados_pagina": 15000,
                "resultado_inicial": 0,
                "dataDe": "2023-06-01",
                "dataAte": dataAtualFormatada,
                "assinados": true,
                "nao_assinados": false,
                "todosOsDocumentos": true,
                "indiceBusca": indice,
                "validarCheckout": false
            };
            
            return new Promise((resolve, reject) => {
                // Fazer a requisição POST usando Axios
                axios.post(url, post, { headers })
                  .then(response => {
                    //console.log('Deu certo');
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
            //const url = `http://172.16.16.106:8080/api/matricula/codAluno/${matricula}/obterAluno`;

            const headers = {
               'Authorization': 'Basic YXBpdXNlcjphcGl1c2VyQDEyMw==',
                "Content-Type": "application/json"
            }

            return new Promise((resolve, reject) => {
                // Fazer a requisição POST usando Axios
                axios.get(url, { headers })
                .then(response => {
                    //console.log('API do Lyceum');
                    //console.log(response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
            });

        }catch(error){
            console.error('Erro na API do Lyceum:', error);
            throw error; // Rejeita a Promessa com o erro
        }
    }


    async trataDados(){
        
        try{
            const dados = await this.consultaDocumentos()
            console.log('Entrou no tratamento de dados')
            
            const documentosAbaris = [];

            const resultados = await Promise.all(dados.map(async (e) => {

                //console.log('------ DOCS ------')
               // console.log(e);


                let id_doc;

                switch(e.nomeTipoDocumento){
                    case 'CPF':
                        id_doc = 43;
                        break;
                    case 'HISTÓRICO ESCOLAR':
                        id_doc = 46;
                        break; 
                    case 'CERTIFICADO ENSINO MÉDIO':
                        id_doc = 45;
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

                const matricula = [];
                
                const caminhoCompleto = e.caminhoCompleto;
                    
                const partes = caminhoCompleto.split('/');
                const nomeDocumento = partes[partes.length - 1];
                

                const idDocGeD = e.id;

                const dataAtual = new Date();
                const ano = dataAtual.getFullYear();
                const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Os meses são indexados de 0 a 11
                const dia = dataAtual.getDate().toString().padStart(2, '0');
                const horas = dataAtual.getHours().toString().padStart(2, '0');
                const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
                const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
                const milissegundos = dataAtual.getMilliseconds().toString().padStart(3, '0');
                
                const dataHoraFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}.${milissegundos}`;


                const pessoaPromises = e.documentoIndice
                .filter(indice => indice.nomeIndice == 'MATRICULA')
                .map(async indice => {
                    
                    //matricula.unshift(indice.valor);
                    
                    const pessoa = await this.dadosAluno(indice.valor);
                
                    documentosAbaris.push({
                        ID_DOCUMENTO_PROCESSO : id_doc,
                        PESSOA: pessoa.pessoa,
                        ALUNO: indice.valor,
                        STATUS: 'Entregue',
                        DT_ENTREGA: dataHoraFormatada,
                        ID_DOC_GED : idDocGeD, /* ID DO DOC NO ABARIS */ 
                        EXTENSAO: 'pdf', 
                        ORIGEM: 'Migração Ábaris',
                        ACEITO: 'S',
                        FORMA_ARMAZENAMENTO: 'Nuvem',
                        NOME_ARQUIVO: nomeDocumento,
                        DT_INSERCAO: dataHoraFormatada,
                        DT_ULT_ALT: dataHoraFormatada,
                        CODIGO_SIGA: '125.43 - GRADUAÇÃO' 
                    })
                });
            }));

            return documentosAbaris;

        }catch(error){
            console.log("Erro no tratamento de dados: ", error)
            throw error;
        }
    }


    async inserirDados(){

        // Documentos retornados da API do Ábaris
        const documentosAbaris = await this.trataDados();
       
        // Documentos retornados do Lyceum (via banco)
        const documentosLyceum = await DocumentosPesssoaDAO.listarDocumentos();
        
        // Array para armazenar os documentos ausentes
        const documentosAusentes = [];

        // Percorrer os documentos do Ábaris
        for (const docAbaris of documentosAbaris) {
            let documentoEncontrado = false;

            // Percorrer os documentos do Lyceum
            for (const docLyceum of documentosLyceum) {
                //console.log('Ábaris: ' + docAbaris.ID_DOC_GED +  ' Lyceum: ' + docLyceum.ID_DOC_GED)
                
                if (docAbaris.ID_DOC_GED == docLyceum.ID_DOC_GED) {
                        //console.log('---------------------------Achou um documento -------------------------------')
                        //console.log('Ábaris: ' + docAbaris.ID_DOC_GED +  ' Lyceum: ' + docLyceum.ID_DOC_GED)
                        documentoEncontrado = true;
                        break;
                }
            }

            // Se o documento não foi encontrado no Lyceum, adicionar aos documentos ausentes
            if (!documentoEncontrado) {
                documentosAusentes.push(docAbaris);
            }
        }


        console.log(documentosAusentes)
        console.log(documentosAbaris)
        console.log("Documentos Abaris: " + documentosAbaris.length)
        console.log("Documentos Lyceum: " + documentosLyceum.length)
        console.log("Documentos Ausentes: " + documentosAusentes.length)
        

      /* for(const docAusentes of documentosAusentes){
            console.log(docAusentes);
           // DocumentosPesssoaDAO.inserirDocumento(docAusentes)
       }*/
        return 'Deu certo';
    }


 

}

// padrão Singleton
export default new IntegracaoController()