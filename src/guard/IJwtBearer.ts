import { IJwtUser } from "../lib";

export interface IJwtBearer<T extends IJwtUser = IJwtUser> {
    user?: T;
    token: string;
}