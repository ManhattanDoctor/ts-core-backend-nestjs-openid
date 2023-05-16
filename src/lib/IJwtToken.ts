export interface IJwtToken {
    idToken: string;
    scope: string;
    tokenType: string;
    expiresIn: number;
    accessToken: string;
    sessionState: string;
    notBeforePolicy: number;

    refreshToken: string;
    refreshExpiresIn: number;
}