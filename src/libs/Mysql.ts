import { Databases, Dialect } from './Databases';

export class Mysql extends Databases {
    protected static dialect = Dialect.mysql;
}
