import sql from "mssql";
import DatabaseConfig from "./DatabaseConfig.js";

class Conexao{
  
  config = {
    user: DatabaseConfig.user,
    password: DatabaseConfig.password,
    server: DatabaseConfig.server,
    database: DatabaseConfig.database,
    port: DatabaseConfig.port,
    options: DatabaseConfig.options,
  };

  async conectar() {
    try {
      await sql.connect(this.config);
      console.log("Conexão bem-sucedida ao banco de dados");
    } catch (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
    }
  }

}

// padrão Singleton
export default new Conexao()
