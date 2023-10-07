import { Request, Response } from 'express';
import authService from '@/services/auth-service';

const accessTokenHeader = process.env.ACCESS_HEADER
if (!accessTokenHeader) {
    console.log("Missing ACCESS_HEADER")
    process.exit()
}

const refreshTokenHeader = process.env.REFRESH_HEADER
if (!accessTokenHeader) {
    console.log("Missing REFRESH_HEADER")
    process.exit()
}

export function authJWT(req: Request, res: Response, next: Function) {
  const token = req.get(accessTokenHeader!);

  if (token) {
    try {
      req.params.userId = authService.verifyAccessToken(token).userId;
      next();
    } catch(err) {
      console.log("Token verification failed", err)

      if (process.env.LOGIN_URL) {
        res.redirect(process.env.LOGIN_URL);
      } else {
        console.log("Missing LOGIN_URL")
        res.status(500).send()
      }
    }
  } else {
    if (process.env.LOGIN_URL) {
      res.redirect(process.env.LOGIN_URL);
    } else {
      console.log("Missing LOGIN_URL")
      res.status(500).send()
    }
  }
}