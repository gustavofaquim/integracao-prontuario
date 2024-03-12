import axios from "axios";
import documentosDAO from "../bd/documentosDAO.js";

const alunoController = {
    

    buscarDadosAluno: async(matricula) => {

        try {
            
            const url = `http://172.16.16.37:8080/api/matricula/codAluno/${matricula}/obterAluno`;

            const headers = {
                'Authorization': 'Basic YXBpdXNlcjphcGl1c2VyQDEyMw==',
                 "Content-Type": "application/json"
            }

            const response = await axios.get(url, { headers });


            return response.data?.pessoa;
            

        } catch (error) {
            console.log('Erro ao obter aluno do Lyceum: ' + matricula);
            return null;
        }
    },


    listarPessoasSemDocumentos: async(pessoas) => {
        try {
            
            const response = await documentosDAO.listarPessoasSemDocumentos(pessoas);
            return response;

        } catch (error) {
            console.error('Erro ao obter a lista de pessoas do Lyceum' + error);
            return null;
        }
    }
    
}

export default alunoController; 