declare const $ENV: Env;

export const environment = {
  production: true,
  apiUrl: $ENV.RECON_API_URL || '127.0.0.1:8080' // change it later,
};
