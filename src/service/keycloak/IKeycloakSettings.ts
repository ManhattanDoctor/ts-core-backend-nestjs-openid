export interface IKeycloakSettings {
    url: string;
    
    realm: string;
    realmPublicKey: string;

    clientId: string;
    clientSecret: string;
}