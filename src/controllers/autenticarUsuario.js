import axios from "axios";

const autenticarUsuario = {

   autenticarAbaris: async() => {
        try {
            const url = "https://documents.abaris.com.br/api/v1/login/";

            const headers = {
                'Custom-Origin': 'aee.abaris.com.br',
                'Content-Type': 'application/json'
            }; 
        
            // Corpo da solicitação POST
            const data = {
                userName: 'integracao-prontuario',
                password: 'A#f!325S'
            };
        
            // Fazer a requisição POST usando Axios
            const response = await axios.post(url, data, { headers });
        
        
            const key = response.data;

            return key;

        } catch (error) {
            console.error(error);
            throw new Error('Erro ao autenticar usuário no Ábaris');
        }
   }

}

export default autenticarUsuario;