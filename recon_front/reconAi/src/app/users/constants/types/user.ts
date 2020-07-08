export interface UserInterface {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  isActive: boolean;
  createdDT: string;
  id: string;
}

export interface DeleteUserDialogInterface {
  id: string;
  name: string;
}

export interface AddUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
