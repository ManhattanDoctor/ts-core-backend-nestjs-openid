import { IJwtUser } from "../lib";

export interface IJwtBearer {
    user?: IJwtUser;
    token: string;
}