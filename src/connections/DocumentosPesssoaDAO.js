import sql from "mssql";
import Conexao from "./Conexao.js";

class DocumentosPessoaDAO {

  constructor() {
    this.pool = new sql.ConnectionPool({
      ...Conexao.config,
      pool: {
        max: 100, // Ajuste este valor conforme necessário
      }
    });
  }


  async listarDocumentos() {
    let pool;

    try {
      pool = await this.pool.connect();

      const result = await pool
        .request()
        .query(
          'SELECT ID, ID_DOCUMENTO_PROCESSO, PESSOA, ID_DOC_GED FROM LY_DOCUMENTOS_PESSOA WHERE ID_DOC_GED IS NOT NULL'
          );

      return result.recordset;

    } catch (err) {
      //console.error('Erro ao buscar documentos:', err);
      throw new Error('Erro ao buscar documentos');
    } finally {
      if (pool) {
        pool.close();
      }
    }
  }


  async inserirDocumento(documento) {
    let pool;

    try {
      pool = await this.pool.connect();
      const request = pool.request();

      const query = `
        INSERT INTO LY_DOCUMENTOS_PESSOA 
        (ID_DOCUMENTO_PROCESSO, PESSOA, ALUNO, STATUS, DT_ENTREGA, ID_DOC_GED, EXTENSAO, ORIGEM, ACEITO, FORMA_ARMAZENAMENTO, NOME_ARQUIVO, DT_INSERCAO, DT_ULT_ALT, CODIGO_SIGA) 
        VALUES (
        @ID_DOCUMENTO_PROCESSO, @PESSOA, @ALUNO, @STATUS, @DT_ENTREGA, @ID_DOC_GED, @EXTENSAO, @ORIGEM, @ACEITO, @FORMA_ARMAZENAMENTO, @NOME_ARQUIVO, @DT_INSERCAO, @DT_ULT_ALT, @CODIGO_SIGA
        )`;

      //console.log(documento);


      await request
        .input('ID_DOCUMENTO_PROCESSO', documento.ID_DOCUMENTO_PROCESSO)
        .input('PESSOA',  documento.PESSOA)
        .input('ALUNO',  documento.ALUNO)
        .input('STATUS',  documento.STATUS)
        .input('DT_ENTREGA', documento.DT_ENTREGA)
        .input('ID_DOC_GED',  documento.ID_DOC_GED)
        .input('EXTENSAO',  documento.EXTENSAO)
        .input('ORIGEM',  documento.ORIGEM)
        .input('ACEITO',  documento.ACEITO)
        .input('FORMA_ARMAZENAMENTO',  documento.FORMA_ARMAZENAMENTO)
        .input('NOME_ARQUIVO',  documento.NOME_ARQUIVO)
        .input('DT_INSERCAO',  documento.DT_INSERCAO)
        .input('DT_ULT_ALT',  documento.DT_ULT_ALT)
        .input('CODIGO_SIGA',  documento.CODIGO_SIGA)
        .query(query);

      return 'Dados inseridos com sucesso.';
      
    } catch (err) {
      console.error(`Erro ao gravar documento: ${documento.ID_DOCUMENTO_PROCESSO} - matricula: ${documento.ALUNO} - ${err.message}` );
      throw new Error('Erro ao gravar documento');
    } finally {
      if (pool) {
        pool.close();
      }
    }
  }
}

export default new DocumentosPessoaDAO();
