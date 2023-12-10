import { Request, Response, NextFunction } from "express";
declare const authJwt: {
  verifyToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Response<any, Record<string, any>> | undefined;
  isAdmin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
  isOwner: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
  isAgent: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
  isMonitor: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
};
export default authJwt;
