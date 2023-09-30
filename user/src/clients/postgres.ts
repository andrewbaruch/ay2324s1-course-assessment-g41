import { Pool, QueryResult, QueryResultRow } from 'pg';

class PostgresClient {
    private readonly pool: Pool;

    constructor(connectionString: string) {
    this.pool = new Pool({
        max: 10,
        connectionString: connectionString,
        idleTimeoutMillis: 30000
    });
    }

    public async query<T extends QueryResultRow>(
        sql: string,
        values?: any[]
    ): Promise<QueryResult<T>> {
        const client = await this.pool.connect();
        
        try {
            return await client.query(sql, values);
        } finally {
            client.release(); 
        }
    }

    public async disconnect(): Promise<void> {
    await this.pool.end();
    }
}

export const postgresClient = new PostgresClient(
    process.env.POSTGRES || "NA"
);
