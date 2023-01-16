declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DATABASE_NAME: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export { };
