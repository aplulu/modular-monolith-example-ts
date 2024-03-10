export const host = process.env.HOST ?? 'localhost';

export const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
