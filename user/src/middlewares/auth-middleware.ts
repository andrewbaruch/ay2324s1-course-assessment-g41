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
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
}
  