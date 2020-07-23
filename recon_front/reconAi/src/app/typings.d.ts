interface Process {
  env: Env;
}

interface Env {
  RECON_API_URL: string;
}

interface GlobalEnvironment {
  process: Process;
}

declare var Stripe: any;
