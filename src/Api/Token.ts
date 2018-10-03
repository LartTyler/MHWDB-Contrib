interface JwtBody {
	sub: string;
	exp: number;
}

export class Token {
	protected _jwt: string;
	protected _body: JwtBody;

	public constructor(jwt: string) {
		this._jwt = jwt;
		this._body = JSON.parse(atob(jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.') - 1)));
	}

	public get jwt(): string {
		return this._jwt;
	}

	public getExpiration(): number {
		return this._body.exp;
	}
}