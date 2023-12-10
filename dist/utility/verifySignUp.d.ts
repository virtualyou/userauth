import { NextFunction, Request, Response } from 'express';
declare const verifySignUp: {
    checkDuplicateUsernameOrEmail: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    checkRolesExisted: (req: Request, res: Response, next: NextFunction) => void;
};
export default verifySignUp;
