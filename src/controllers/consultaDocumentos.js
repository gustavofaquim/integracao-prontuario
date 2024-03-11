import axios from "axios";

import autenticarUsuario from "./autenticarUsuario.js";
import dataController from "./dataController.js";
import documentosDAO from "../bd/documentosDAO.js";
import logsDAO from "../bd/logsDAO.js";

const consultaDocumentos = {
    
    listarTodos: async() => {

        try {
            
            const url = 'https://documents.abaris.com.br/api/v1/document/advanced-search';

            const autenticacao = await autenticarUsuario.autenticarAbaris();
           
            if(autenticacao.rsaKey == undefined){
                return res.status(500).json('Token de autenticação invalido');
            }
            
            const auth = autenticacao.rsaKey;

            const headers = {
                "x-api-key": auth,
                "Content-Type": "application/json"
            }; 

            const idsTiposDoc = [79,85,84,80,88,95,81,78,86];
            const indice = [];
            
            const filtroCodigoSiga = {
                "nome": "CODIGO SIGA",
                "operador": "=",
                "valor": "125.43 - GRADUAÇÃO"
            };
            
            const dataAtual = await dataController.dataAtual();
            
            // Criando uma nova variável com a data de 7 dias atrás
            const dataSeteDiasAtras = new Date(dataAtual);
            dataSeteDiasAtras.setDate(dataAtual.getDate() - 5);

            
            const configBusca = {
                "ids_tipodocumento": idsTiposDoc,
                "resultados_pagina": 19000,
                "dataDe": dataSeteDiasAtras,
                "dataAte": dataAtual,
                "assinados": true,
                "nao_assinados": false,
                "indiceBusca": indice,
            };

            
            const post = JSON.stringify(configBusca).replace(/'/g, '"');
            
            const response = await axios.post(url,post, {headers});
            
            const docs = response.data?.documentos;

            return docs;
          
        } catch (error) {
            console.log('Erro ao listar documentos: ' + error)
            return 'Erro ao listar documentos';
        }
    },


    //Converte os documentos obtidos no Ábaris para um formato valido no Lyceum
    tratarDocumentos: async(docs) => {

        try {

            let documentos = [];
            let pessoas = [];
            
            for (const e of docs) {

                let id_doc;

                // Fazendo depara com os códigos que tem que entrar no Lyceum
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

                // Pegando o nome do documento
                const caminhoCompleto = e.caminhoCompleto;
                const partes = caminhoCompleto.split('/');
                const nomeDocumento = partes[partes.length - 1];

                // Id do doc no Ábaris
                const idDocGeD = e.id;

                const dataAtual = await dataController.dataAtual();

                const montagemDocs = await Promise.all(
                     e.documentoIndice
                    .filter(indice => indice.nomeIndice == 'MATRICULA')
                    .map(async indice => {


                        const pessoa = await alunoController.buscarDadosAluno(indice.valor);
                        
                        if(!pessoa){
                            return;
                        }

                        pessoas.push(pessoa);
                        
                        return {
                            ID_DOCUMENTO_PROCESSO : id_doc,
                            PESSOA: pessoa,
                            ALUNO: indice.valor,
                            STATUS: 'Entregue',
                            DT_ENTREGA: dataAtual,
                            ID_DOC_GED : idDocGeD, /* ID DO DOC NO ABARIS */ 
                            EXTENSAO: 'pdf', 
                            ORIGEM: 'Migração Ábaris',
                            ACEITO: 'S',
                            FORMA_ARMAZENAMENTO: 'Nuvem',
                            NOME_ARQUIVO: nomeDocumento,
                            DT_INSERCAO: dataAtual,
                            DT_ULT_ALT: dataAtual,
                            CODIGO_SIGA: '125.43 - GRADUAÇÃO' 
                        };

                    })
                );


                const docs = montagemDocs
                .filter(result => result !== null && result !== undefined)
                .flat();

                if(docs.length > 0){
                    documentos.push(...docs);
                }

            };

            // Verificar se o tipo de dados que está sendo retornado está correto.
            
            let p = new Set(pessoas);
            p = [...p];

            return {documentos, p};

        } catch (error) {
            console.error(error);
            throw new Error('Erro na montagem dos dados para o Lyceum');
        }
    },


    // Passar os documentos já formatados
    preparaInsercao: async() => {
        try {
            
            const docAbaris = await consultaDocumentos.listarTodos();
            const documentosTratados = await consultaDocumentos.tratarDocumentos(docAbaris); // {documentos e p}

            const resultpessoas = documentosTratados.p
            const documentosAbaris = documentosTratados.documentos
            const pessoas = resultpessoas.filter(valor => !isNaN(valor)); // Filtrando somente os códigos que são numericos

            const documentosLyceum = await alunoController.listarPessoasSemDocumentos(pessoas);
           
           
            // Verificar quais documentos existem em documentosAbaris e não em documentosLyceum
            const documentosNaoEncontrados = documentosAbaris.filter(abaris => {
                return !documentosLyceum.some(lyceum => lyceum.ID_DOC_GED == abaris.ID_DOC_GED);
            });

            return documentosNaoEncontrados;

        } catch (error) {
            console.error(error);
            throw new Error('Erro ao inserir os documentos no Lyceum'); 
        }
    },


    insereDocumentos: async(req,res) => {
        try {
            
            const docs = await consultaDocumentos.preparaInsercao();

            const resultado = await documentosDAO.insereDocumentos(docs);
            
            let log;

            if(resultado == 'sucesso'){
                log = {status: 'sucesso', msg: 'Integração executada com sucesso', qnt:docs.length}
            }else if(resultado == 'erro'){
                log = {status: 'erro', msg: 'Falha na execução da integração', qnt: NULL} ;
            }


          if(log.status){
                const logResult = await logsDAO.insereLog(log);
           }

            return res.json(resultado);

        } catch (error) {
            console.error('Deu erro aqui ' + error)
            return res.json('Erro')
        }


    }

}

export default consultaDocumentos;