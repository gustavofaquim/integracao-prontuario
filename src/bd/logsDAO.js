import Conexao from "../connections/Conexao.js";

const logsDAO = {

    listaTodos: async() => {
        try {
            
            await Conexao.conectar();

            const logs = [];

            const resultado = await Conexao.sql.query`SELECT STATUS, MENSAGEM, QUANTIDADE, CONVERT(VARCHAR(30), DATA,103) + ' ' + CONVERT(VARCHAR(10), DATA, 108) AS DATA  FROM UNIEV_INTEGRACAO_PRONTUARIO WHERE MONTH(DATA) >= (MONTH(GETDATE()) - 1) ORDER BY DATA DESC`;
            logs.push(...resultado.recordset);

            return logs;
            
        } catch (error) {
            console.log('Erro ao obter os logs do Lyceum', error.message);
            return 'Erro ao obter os logs do Lyceum';
        }finally {
            await Conexao.desconectar();
        }
    },

    insereLog: async(log) => {
        try {
            await Conexao.conectar();

            const {status, msg, qnt} = log;

            const resultado = await Conexao.sql.query`INSERT INTO UNIEV_INTEGRACAO_PRONTUARIO (STATUS, MENSAGEM, QUANTIDADE, DATA) VALUES (${status}, ${msg}, ${qnt}, GETDATE())`;

            return 'Log gravado no Lyceum';

        } catch (error) {
            console.log('Erro ao gravar log no Lyceum', error.message);
            return 'Erro ao gravar log no Lyceum';
        }finally {
            await Conexao.desconectar();
        }
    }
}   

export default logsDAO;