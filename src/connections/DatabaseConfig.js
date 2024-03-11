// DatabaseConfig.js
export const databaseConfig = {
  server: 'DATASERVER',
  database: 'lyceum',
  user: 'lyceum',
  password: 'lyceum',
  port: 1433, // opcional, se necessário
  options: {
    encrypt: false, // se estiver usando SSL, altere para true
  },
};
