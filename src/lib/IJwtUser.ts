export interface IJwtUser {
    sub: string;
    name: string;
    email: string;
    givenName: string;
    familyName: string;
    emailVerified: boolean;
    preferredUsername: string;

    [key: string]: any;
}