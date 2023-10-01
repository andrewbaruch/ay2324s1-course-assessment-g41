import { Request, Response } from 'express';
import authService from '@/services/auth-service';

export function authJWT(req: Request, res: Response, next: Function) {
  const token = req.cookies.jwt;

  if (token) {
    try {
      req.params.userId = authService.verifyToken(token).userId;
      next();
    } catch(err) {
      console.log("Token verification failed", err)

      // TODO: login path
      if (process.env.LOGIN_URL) {
        res.redirect(process.env.LOGIN_URL);
      } else {
        console.log("Missing LOGIN_URL")
        res.redirect(req.hostname)
      }
    }
  } else {
    if (process.env.LOGIN_URL) {
      res.redirect(process.env.LOGIN_URL);
    } else {
      console.log("Missing LOGIN_URL")
      res.redirect(req.hostname)
    }
  }
}
  