import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface Payload extends jwt.JwtPayload {
    userId: string
}

export function getUserInfoJWT(req: Request, res: Response, next: Function) {
    console.log("JWT")
    // TODO: Remove after auth server
    if (true || process.env.EXE_ENV === "DEV") {
      req.params.userId = "uid"
      next()
    }

    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT || 'DEV_JWT') as Payload; 
        req.params.userId = decodedToken.userId;

        next();
      } catch (error) {
        res.status(401);
      }
    } else {
      res.status(401);
    }
  }
  
  export function getUserInfoSession(req: Request, res: Response, next: Function) {
    // TODO: GET SESSION
    // TODO: Remove after auth server
    if (process.env.EXE_ENV === "DEV") {
        req.params.userId = "uid"
        next()
    }

    const userId = "uid"

    if (userId) {
      req.params.userId = userId; 
      next();
    } else {
      res.status(401);
    }
  }
  