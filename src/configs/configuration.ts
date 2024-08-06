export default () => ({
    // Server
    POST: Number(process.env.PORT ?? 5000),

    // Database
    PG_URL: process.env.PG_URL ?? "postgresql://postgres:password@localhost:5432/postgres",
    REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",

    /// JWT
    JWT_SECRET: process.env.JWT_SECRET ?? "dRYjpuVfGUTCDttLnTON6KBP6q1kDLUD9ocnoVZAx7Ggmr0aMWK0ABw8JbMys",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION ?? "30d", // 30 days

    /// Cookie
    DOMAIN: process.env.DOMAIN ?? ".skysolo.me",
    COOKIE_NAME: process.env.COOKIE_NAME ?? "sky.inc-token",
    COOKIE_PATH: process.env.COOKIE_PATH ?? "/",
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? ".skysolo.me",
    COOKIE_MAX_AGE: Number(process.env.COOKIE_EXPIRATION ?? 30) * 24 * 60 * 60 * 1000, // 30 days
});