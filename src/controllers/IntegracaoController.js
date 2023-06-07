import axios from "axios";

class IntegracaoController{

    constructor() {
        this.autenticacao = this.autenticacao.bind(this);
        this.api = this.api.bind(this);
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

    
    async api(req,res){

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

            
            const tipoDoc = 'CPF'

            let tipoIndice = 'UNIEVANGELICA'
            const indice = [];

            const novoElemento = {
                "nome": "MANTIDA",
                "operador": "=",
                "valor": tipoIndice
            };

            indice.push(novoElemento);

            
            const post = {
                "nomes_tipodocumento": [tipoDoc],
                "resultados_pagina": 15000,
                "resultado_inicial": 0,
                "dataDe": "2023-06-01",
                "indiceBusca": indice
            };
            

            // Fazer a requisição POST usando Axios
            axios.post(url, post, {headers})
            .then(response => {
                console.log('Deu certo')
                //console.log(response.data.documentos);
                res.status(200).json(response.data.documentos)                
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({errors: [{msg: 'Error.' + ' ' + error}]})
            });

        }catch (error) {
            console.error('Erro na autenticação:', error);
        }
    }

}

// padrão Singleton
export default new IntegracaoController()