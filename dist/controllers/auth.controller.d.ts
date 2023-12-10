import { Request, Response } from 'express';
declare const authController: {
    signup: (req: Request, res: Response) => Promise<void>;
    signin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    signout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default authController;
