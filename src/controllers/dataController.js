
const dataController = {

    dataAtual: async() => {
        
        try {

            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Os meses são indexados de 0 a 11
            const dia = dataAtual.getDate().toString().padStart(2, '0');

      
            return new Date(`${ano}-${mes}-${dia}`)

        } catch (error) {
            console.error(error);
            throw new Error('Erro ao montar data atual');
            
        }
    }
}

export default dataController; 