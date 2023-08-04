
class DatabaseConfig{
  constructor() {
    //this.server = 'DES03';
    this.server = 'DATASERVER';
    this.database = 'lyceum';
    this.user = 'lyceum';
    this.password = 'lyceum';
    this.port = 1433; // opcional, se necessário
    this.options = {
      encrypt: false, // se estiver usando SSL, altere para true
    };
  }
}
export default new DatabaseConfig()