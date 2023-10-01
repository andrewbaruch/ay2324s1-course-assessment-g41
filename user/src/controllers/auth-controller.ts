import { Request, Response } from 'express';
import authService from '@/services/auth-service';
import userService from '@/services/user-service';


export async function registerUsername(req: Request, res: Response): Promise<void> {
    const { username, password, user } = req.body;
  
    try {
      const userId = await authService.checkCredentials(username, password);
      const token = authService.generateToken(userId);
      
      res.cookie('jwt', token);
      res.status(200).json({ message: 'Login successful', userId });
    } catch (error) {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
  }

export async function usernameAuth(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  try {
    const userId = await authService.checkCredentials(username, password);
    const token = authService.generateToken(userId);

    res.cookie('jwt', token);
    res.status(200).send();
  } catch (error) {
    res.status(401).json({ message: 'Invalid login credentials' });
  }
}

export function googleAuth(req: Request, res: Response): void {
  const authUrl = authService.getGoogleAuthURL();
  res.redirect(authUrl);
}

export async function googleRedirect(req: Request, res: Response): Promise<void> {
  const code = req.query.code;

  try {
    const userInfo = await authService.googleCallback(code as string);

    const user = await userService.readByEmail(userInfo.email)

    if (!user) {
        //user reg path
        res.redirect("/")
    }
    
    const token = authService.generateToken(user!.id);
    res.cookie('jwt', token);
    
    // NOTE: redirect to base path/ redirect url
    res.redirect(req.hostname); 
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Google Auth failed' });
  }
}

export function logout(req: Request, res: Response): void {
    res.clearCookie('jwt');

    // NOTE: redirect URL
    res.redirect(req.hostname);
  }