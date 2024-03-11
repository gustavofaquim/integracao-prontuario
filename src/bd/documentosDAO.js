import Conexao from "../connections/Conexao.js";

const documentosDAO = {
  listarPessoasSemDocumentos: async (pessoas) => {
    try {
      const documentosLyceum = [];
      await Conexao.conectar();

      for (const pessoa of pessoas) {
        const resultado = await Conexao.sql.query`SELECT ID, ID_DOCUMENTO_PROCESSO, PESSOA, ID_DOC_GED FROM LY_DOCUMENTOS_PESSOA WHERE ID_DOC_GED IS NOT NULL AND PESSOA = ${pessoa}`;
        documentosLyceum.push(...resultado.recordset); // Usando spread (...) para adicionar cada item do resultado individualmente
      }

      return documentosLyceum;

    } catch (error) {
      console.error('Erro ao obter a lista de pessoas do Lyceum', error.message);
      return 'Erro ao obter a lista de pessoas do Lyceum';
    } finally {
      await Conexao.desconectar();
    }
  },


  insereDocumentos: async(docs) => {
    try {
      
      await Conexao.conectar();

      for(const doc of docs){

        const { ID_DOCUMENTO_PROCESSO, PESSOA, ALUNO, STATUS, DT_ENTREGA,ID_DOC_GED, EXTENSAO, ORIGEM, 
          ACEITO, FORMA_ARMAZENAMENTO, NOME_ARQUIVO,DT_INSERCAO, DT_ULT_ALT, CODIGO_SIGA } = doc;

          const resultado = await Conexao.sql.query`
          INSERT INTO LY_DOCUMENTOS_PESSOA (ID_DOCUMENTO_PROCESSO, PESSOA, ALUNO, STATUS, DT_ENTREGA, ID_DOC_GED, EXTENSAO, ORIGEM, ACEITO, FORMA_ARMAZENAMENTO, NOME_ARQUIVO, DT_INSERCAO, DT_ULT_ALT, CODIGO_SIGA) 
          VALUES (${ID_DOCUMENTO_PROCESSO}, ${PESSOA}, ${ALUNO}, ${STATUS}, ${DT_ENTREGA}, ${ID_DOC_GED}, ${EXTENSAO}, ${ORIGEM}, ${ACEITO}, ${FORMA_ARMAZENAMENTO}, ${NOME_ARQUIVO}, ${DT_INSERCAO}, ${DT_ULT_ALT}, ${CODIGO_SIGA});`;
      }
      
      return 'sucesso';

    } catch (error) {
      console.error('Erro ao inserir os documentos no Lyceum ' + error);
      return 'erro';
    } finally {
      await Conexao.desconectar();
    }
  }
};

export default documentosDAO;
