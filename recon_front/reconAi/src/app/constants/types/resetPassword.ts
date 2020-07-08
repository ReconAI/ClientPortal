export interface ResetPasswordInterface {
  password1: string;
  password2: string;
}

export interface ActivationInterface {
  uidb64: string;
  token: string;
}

export interface ResetPasswordWithMetaInterface {
  password1: string;
  password2: string;
  uidb64: string;
  token: string;
}
