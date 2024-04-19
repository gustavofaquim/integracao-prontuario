import dotenv from 'dotenv';

dotenv.config();

const { SERVER, DATABASE, USER, PASSOWRD, PORT } = process.env;


// DatabaseConfig.js
export const databaseConfig = {
  server: SERVER,
  database: DATABASE,
  user: USER,
  password: PASSOWRD,
  port: 1433, // opcional, se necessário
  options: {
    encrypt: false, // se estiver usando SSL, altere para true
  },
};
