export interface IUser{
    username: string;
    email: string;
    avatar?: string;
    coins?: number;
    is_staff?: boolean; 
}

export interface IUserLogin{
    email: string;
    password: string;
}

export interface IUserRegister{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}