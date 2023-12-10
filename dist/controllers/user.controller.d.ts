import { Request, Response } from "express";
declare const userController: {
  allAccess: (_req: Request, res: Response) => void;
  ownerBoard: (_req: Request, res: Response) => void;
  agentBoard: (_req: Request, res: Response) => void;
  monitorBoard: (_req: Request, res: Response) => void;
  adminBoard: (_req: Request, res: Response) => void;
  getUserRoles: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  getUserById: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  getAllUsers: (_req: Request, res: Response) => Promise<void>;
};
export default userController;
