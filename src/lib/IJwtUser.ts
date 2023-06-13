export interface IJwtUser {
    sub: string;
    name: string;
    email: string;
    given_name: string;
    family_name: string;
    email_verified: boolean;
    preferred_username: string;

    [key: string]: any;
}