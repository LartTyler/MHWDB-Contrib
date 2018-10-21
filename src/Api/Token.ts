import {Role} from '../Components/RequireRole';

interface IJwtBody {
	sub: string;
	exp: number;
	roles: Role[];
	username: string;
}

export class Token {
	public readonly jwt: string;
	public readonly body: IJwtBody;

	public constructor(jwt: string) {
		this.jwt = jwt;
		this.body = JSON.parse(atob(jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))));
	}

	public isValid(): boolean {
		return this.getTimeToLive() > 0;
	}

	public getTimeToLive(): number {
		return this.body.exp - Math.floor(Date.now() / 1000);
	}
}
