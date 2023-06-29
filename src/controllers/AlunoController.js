
import sql from "mssql";
import Conexao from '../connections/Conexao.js';

class AlunoController {
    
    async listarAluno(req, res) {
      try {
        const pool = await sql.connect(Conexao.config);
        const result = await pool.request().query('SELECT TOP 10 * FROM LY_ALUNO');
        res.send(result.recordset);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro ao buscar usuários');
      }
    }
  }

export default new AlunoController()