import { AuthInterface, RoleInterface, UserInterface } from '@modules/auth/interfaces';

export interface SignInResponseInterface {
    data: DataSignInInterface;
    message: string;
    title: string;
    accessToken: string;
}

export interface DataSignInInterface {
    auth: AuthInterface;
    accessToken: string;
    roles: RoleInterface[];
}
