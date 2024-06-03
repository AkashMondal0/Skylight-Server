const _configs = {
    appUrl: process.env.NEXTAUTH_URL,
    serverApi: {
        baseUrl: process.env.SERVER_API_URL,
        dataBaseUrl: process.env.DATABASE_URL,
    },
    supabase: {
        bucketUrl: process.env.SUPABASE_BUCKET_URL,
        clientKey: process.env.SUPABASE_CLIENT_KEY,
        clientUrl: process.env.SUPABASE_CLIENT
    },
    firebase: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
    }
}

export const configs = Object.freeze(_configs)