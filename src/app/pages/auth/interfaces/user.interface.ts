import { CatalogueInterface, RoleInterface } from '@modules/auth/interfaces';

export interface UserInterface {
  id: string;
  identificationType: CatalogueInterface;
  identificationTypeId: CatalogueInterface;
  sex: CatalogueInterface;
  gender: CatalogueInterface;
  ethnicOrigin: CatalogueInterface;
  bloodType: CatalogueInterface;
  bloodTypeId: CatalogueInterface;
  maritalStatus: CatalogueInterface;
  phones: CatalogueInterface[];
  emails: CatalogueInterface[];
  roles: RoleInterface[];
  avatar: string;
  birthdate: string;
  email: string;
  emailVerifiedAt: Date;
  identification: string;
  lastname: string;
  maxAttempts: number;
  name: string;
  password: string;
  passwordChanged: boolean;
  phone: string;
  suspendedAt: Date;
  username: string;
  termsConditions: string;
}

export interface CreateUserDto extends Omit<UserInterface, 'id'> {
}

export interface UpdateUserDto extends Partial<Omit<UserInterface, 'id'>> {
}

export interface SelectUserDto extends Partial<UserInterface> {
}
