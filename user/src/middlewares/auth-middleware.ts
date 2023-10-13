import { Request, Response } from 'express';
import authService from '@/services/auth-service';

const accessTokenHeader = process.env.ACCESS_HEADER
if (!accessTokenHeader) {
    console.log("Missing ACCESS_HEADER")
    process.exit()
}

export function authJWT(req: Request, res: Response, next: Function) {
  const token = req.get(accessTokenHeader!);

  if (token) {
    try {
      console.log("authJwt: ")
      console.log(authService.verifyAccessToken(token))
      console.log(authService.verifyAccessToken(token).userId)
      res.locals.userId = authService.verifyAccessToken(token).userId;

      next();
    } catch(err) {
      console.log("Token verification failed", err)
      res.status(500).send()
    }
  } else {
      res.status(500).send()
  }
}
