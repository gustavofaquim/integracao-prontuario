
import sql from "mssql";
import Conexao from "./Conexao.js";

class DocumentosPessoaDAO{

  async listarDocumentos() {
        try {
          const pool = await sql.connect(Conexao.config);
          const result = await pool.request().query('SELECT ID, ID_DOCUMENTO_PROCESSO, PESSOA, ID_DOC_GED FROM LY_DOCUMENTOS_PESSOA WHERE ID_DOC_GED IS NOT NULL');
          return result.recordset
          //res.send(result.recordset);
        } catch (err) {
          console.error('Erro ao buscar usuários:', err);
          throw new Error("Erro ao buscar documentos");
          //res.status(500).send('Erro ao buscar usuários');
        }finally {
          sql.close();
        }
  }

  async inserirDocumento(documento){
    console.log('Entrou na inserção de dados');
    
    try{
      await sql.connect(Conexao.config);

      

     // console.log(`ALUNO: ${documento.ALUNO}`)

      // Criando uma solicitação (request) para a inserção
      const request = new sql.Request();

       // Executando o comando de inserção
       const query = `INSERT INTO LY_DOCUMENTOS_PESSOA (ID_DOCUMENTO_PROCESSO,PESSOA, ALUNO, STATUS, DT_ENTREGA, ID_DOC_GED, EXTENSAO, ORIGEM, ACEITO, FORMA_ARMAZENAMENTO, NOME_ARQUIVO, DT_INSERCAO, DT_ULT_ALT, CODIGO_SIGA) 
        VALUES (
        '${documento.ID_DOCUMENTO_PROCESSO}',
        '${documento.PESSOA}', 
        '${documento.ALUNO}', 
        '${documento.STATUS}',
        '${documento.DT_ENTREGA}',
        '${documento.ID_DOC_GED}',
        '${documento.EXTENSAO}', 
        '${documento.ORIGEM}',
        '${documento.ACEITO}',
        '${documento.FORMA_ARMAZENAMENTO}',
        '${documento.NOME_ARQUIVO}',
        '${documento.DT_INSERCAO}',
        '${documento.DT_ULT_ALT}',
        '${documento.CODIGO_SIGA}')`;

        // Executando o comando de inserção
        await request.query(query);  

       // console.log('Dados inseridos com sucesso.');
        return 'Dados inseridos com sucesso.';

    }catch(err){
      console.log('Erro:', err);
      throw new Error("Erro ao gravar documento");
    }finally {
      // Fechando a conexão com o banco de dados
      sql.close();
    }

  }
}

export default new DocumentosPessoaDAO()