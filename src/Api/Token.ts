interface JwtBody {
	sub: string;
	exp: number;
}

export class Token {
	public readonly jwt: string;
	public readonly body: JwtBody;

	public constructor(jwt: string) {
		this.jwt = jwt;
		this.body = JSON.parse(atob(jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))));
	}

	public isValid(): boolean {
		return Math.floor(Date.now() / 1000) < this.body.exp;
	}
}