import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "../entities/Customer";

export const AppDataSource = new DataSource({
    type: "mysql", // Change to mysql/sqlite/mariadb as needed
    host: process.env.MYSQLDB_URL ?? '127.0.0.0',
    port: 3306,
    username: process.env.MYSQLDB_USERNAME ?? 'sail',
    password: process.env.MYSQLDB_PASSWORD ?? 'password',
    database: process.env.MYSQLDB_NAME ?? 'ticketingdb',
    synchronize: false, // Set to false in production
    logging: true,
    entities: [Customer],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
    timezone: '+08:00',
    dateStrings: ['DATETIME'],
    charset: 'utf8mb4_unicode_ci',
});

export const getDatabaseConnection = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
};