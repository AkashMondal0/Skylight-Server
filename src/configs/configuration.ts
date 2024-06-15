export default () => ({
    POST: parseInt(process.env.PORT ?? "5000", 10),
    PG_URL: process.env.PG_URL?? "postgresql://postgres:password@localhost:5432/postgres",
    REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",
    JWT_SECRET: process.env.JWT_SECRET ?? "dRYjpuVfGUTCDttLnTON6KBP6q1kDLUD9ocnoVZAx7Ggmr0aMWK0ABw8JbMys",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION ?? "1d",
});