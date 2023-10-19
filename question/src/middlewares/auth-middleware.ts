import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenKey = "PEERPREPACCESSTOKEN"

interface AccessPayload extends jwt.JwtPayload {
  userId: string
}

const secret = process.env.JWT_SECRET
if (!secret) {
    console.log("Missing JWT_SECRET")
    process.exit()
}

export function authJWT(req: Request, res: Response, next: Function) {
  if (process.env.SKIP_AUTH == 'TRUE') {
    next();
  }
  
  const token = req.cookies[accessTokenKey]

  if (token) {
    try {
      const decoded = jwt.verify(token, secret!) as AccessPayload; 

      res.locals.userId = decoded.userId;

      next();
    } catch(err) {
      res.status(401).send()
    }
  } else {
      res.status(401).send()
  }
}
