// Conexao.js
import sql from "mssql";
import { databaseConfig } from "./DatabaseConfig.js";

class Conexao {
  constructor() {
    this.config = databaseConfig;
    this.sql = sql;
  }

  async conectar() {
    try {
      await this.sql.connect(this.config);
      console.log("Conexão bem-sucedida ao banco de dados");
    } catch (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
    }
  }

  async desconectar() {
    try {
      await this.sql.close();
      console.log("Conexão fechada");
    } catch (err) {
      console.error("Erro ao fechar a conexão:", err);
    }
  }
}

export default new Conexao();
