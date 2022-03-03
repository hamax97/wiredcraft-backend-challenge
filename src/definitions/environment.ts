declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      MONGODB_HOST: string;
      MONGODB_PORT: number;
      MONGODB_USERNAME: string;
      MONGODB_PASSWORD: string;
      MONGODB_DBNAME: string;
      APP_PORT: number;
    }
  }
}

export {};
