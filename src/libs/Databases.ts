import { Connection, createConnection } from 'typeorm';
import { Logger } from './Logger';

export enum Dialect {
    mysql = 'mysql',
    pgsql = 'postgres',
}

export interface DBConnection {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    dialect?: Dialect;
    name?: string;
    entities?: string[];
    logging?: string[];
}

interface ActiveConnections {
    [key: string]: Connection;
}

const connection: DBConnection = {
    host: process.env.MYSQLDB_URL ?? '127.0.0.0',
    port: process.env.MYSQLDB_PORT ? parseInt(process.env.MYSQLDB_PORT) : 3306,
    username: process.env.MYSQLDB_USERNAME ? process.env.MYSQLDB_USERNAME : 'sail',
    password: process.env.MYSQLDB_PASSWORD ? process.env.MYSQLDB_PASSWORD : 'password',
    database: process.env.MYSQLDB_NAME ? process.env.MYSQLDB_NAME : 'ticketingdb',
    dialect: Dialect.mysql,
    entities: [__dirname + '../entities/*{.ts,.js}']
};

let active: ActiveConnections = {};

export class Databases {
    protected static dialect = Dialect.mysql;
    protected static schema: any = 'public';
    protected static conn = 'main';
    protected static connection: DBConnection = connection;

    static async getConnection(name?: string, config?: DBConnection): Promise<Connection> {
        const conn = name ?? this.conn;

        try {
            if (typeof active[conn] === 'undefined') {
                config = config ?? this.connection;
                config.dialect = this.dialect;
                config.entities = [__dirname + '../entities/*{.ts,.js}'];
                const connection = {
                    name: conn,
                    type: config.dialect,
                    host: config.host,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                    database: config.database,
                    entities: config.entities,
                    timezone: '+08:00',
                    dateStrings: ['DATETIME'],
                    charset: 'utf8mb4_unicode_ci',
                    logging: true,
                };
                const { name, type, host, database } = connection;
                let schema = '';

                // if (connection.type === 'postgres') {
                //     schema = this.schema;
                //     connection['schema'] = this.schema;
                // }

                Logger.info('Database Connection INFO:', JSON.stringify({ name, type, host, database, schema }));
                active[conn] = await createConnection(connection);
            }
        } catch (error) {
            Logger.error('Database Error Connection', JSON.stringify(error));
            throw error;
        }

        return active[conn];
    }

    static async closeConnection(): Promise<void> {
        const closing: Array<Promise<void>> = [];

        for (const key in active) {
            if (active.hasOwnProperty(key)) {
                const connection: Connection = active[key];
                closing.push(connection.close());
            }
        }

        active = {};

        await Promise.all(closing);
    }
}
