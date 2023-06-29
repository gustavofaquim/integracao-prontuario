
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
          return 'Erro ao buscar usuários';
          //res.status(500).send('Erro ao buscar usuários');
        }
      }
}

export default new DocumentosPessoaDAO()