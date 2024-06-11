export default () => ({
    POST: parseInt(process.env.PORT, 10),
    PG_URL: process.env.PG_URL,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
});