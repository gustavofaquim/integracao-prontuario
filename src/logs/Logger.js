import winston  from 'winston';

import fs from "fs";

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info', // Nível mínimo de log a ser gravado
            format: this.logFormat(),
            transports: [
                new winston.transports.Console(), // Log para o console
                new winston.transports.File({ 
                    filename: 'src/logs/integration.log', 
                    maxsize: 3 * 1024,
                    maxFiles: 10,
                    tailable: true,
                }) // Log para um arquivo
            ]
        });
    }

    logFormat() {
        return winston.format.combine(
            winston.format.printf(info => {
                const formattedData = info.data ? JSON.stringify(info.data) : '';
                return `${info.message} ${formattedData}`;
                //return `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`;
            })
        );
    }

    info(message, data = null) {
        this.logger.info(message, { data });
    }

    warn(message, data = null) {
        this.logger.warn(message, { data });
    }

    error(message, data = null) {
        this.logger.error(message, { data });
    }



    readLogFile(callback) {
        fs.readFile('src/logs/integration.log', 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo de log:', err);
                return callback(err, null);
            }
    
            return callback(null, data);
        });
    }
}

// padrão Singleton
export default new Logger()
