declare namespace Express {
  export interface Request {
    body: {
      roles: string[];
      username: string;
      password: string;
    };
    session: {
      token: string;
    };
    userId: string;
    ownerId: string;
  }
  export interface Response {
    customProperty: string;
  }
}
