import * as _ from 'lodash';
import { DateUtil, ObjectUtil, TransformUtil } from '@ts-core/common';
import { IJwtUser } from '../../lib';
import { TokenInvalidError } from '../../error';

export class KeycloakToken {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected _value: string;

    protected _header: IJwtTokenHeader;
    protected _signed: string;
    protected _content: IJwtTokenContent;
    protected _signature: Buffer;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(value: string) {
        this.value = value;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitTokenProperties(): void {
        if (_.isNil(this.value)) {
            throw new TokenInvalidError('Token is nil');
        }
        try {
            let array = this.value.split('.');
            this._signed = array[0] + '.' + array[1];
            this._header = TransformUtil.toJSON(Buffer.from(array[0], 'base64').toString());
            this._content = TransformUtil.toJSON(Buffer.from(array[1], 'base64').toString());
            this._signature = Buffer.from(array[2], 'base64');
        } catch (error) {
            throw new TokenInvalidError(error.message);
        }
    }

    protected hasRole(path: string, name: string): boolean {
        let roles = _.get(this.content, path);
        return _.isArray(roles) ? roles.includes(name) : false;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public isExpired(): boolean {
        return this.content.exp * DateUtil.MILLISECONDS_SECOND < Date.now();
    }

    public getUserInfo<T extends IJwtUser>(): T {
        return ObjectUtil.copyProperties(this.content, {});
    }

    public hasClientRole(name: string): boolean {
        return this.hasRole(`resource_access.${this.content.azp}.roles`, name);
    }

    public hasRealmRole(name: string): boolean {
        return this.hasRole('realm_access.roles', name);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get header(): IJwtTokenHeader {
        return this._header;
    }

    public get content(): IJwtTokenContent {
        return this._content;
    }

    public get signed(): string {
        return this._signed;
    }

    public get signature(): Buffer {
        return this._signature;
    }

    public get value(): string {
        return this._value;
    }
    public set value(value: string) {
        if (value === this._value) {
            return;
        }
        this._value = value;
        this.commitTokenProperties();
    }
}

export type IJwtTokenHeader = Record<string, string>;

export type IJwtTokenContent = Record<string, any>;