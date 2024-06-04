const _configs = {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        PG_URL: process.env.PG_URL,
        REDIS_URL: process.env.REDIS_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secretKey',
    }
}

export const configs = Object.freeze(_configs)