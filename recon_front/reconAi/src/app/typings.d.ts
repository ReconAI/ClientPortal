interface Process {
  env: Env;
}

interface Env {
  RECON_API_URL: string;
  ORDER_PORTAL_API_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
}

interface GlobalEnvironment {
  process: Process;
}

declare var Stripe: any;

declare var $ENV: Env;
