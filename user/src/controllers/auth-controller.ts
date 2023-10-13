import { Request, Response } from 'express';
import authService from '@/services/auth-service';
import userService from '@/services/user-service';

const testEmail = "example@email.com"

const accessTokenHeader = process.env.ACCESS_HEADER
if (!accessTokenHeader) {
    console.log("Missing ACCESS_HEADER")
    process.exit()
}

const refreshTokenHeader = process.env.REFRESH_HEADER
if (!refreshTokenHeader) {
    console.log("Missing REFRESH_HEADER")
    process.exit()
}

console.log("auth controller")
console.log(process.env.EXE_ENV)
console.log(process.env.SKIP_AUTH)

export async function googleAuth(req: Request, res: Response): Promise<void> {
  if (process.env.EXE_ENV === 'DEV' && process.env.SKIP_AUTH === 'TRUE') {
    let user = await userService.readByEmail(testEmail)

    if (!user) {
      user = await userService.create(testEmail, "")
    }
    
    const accessToken = await authService.generateAccessToken(user!.id);
    const refreshToken = await authService.generateRefreshToken(user!.id);

    res.status(200).json({ access_token: accessToken, refresh_token: refreshToken })
  }
  const authUrl = authService.getGoogleAuthURL();
  res.redirect(authUrl);
}

export async function googleRedirect(req: Request, res: Response): Promise<void> {
  const code = req.query.code;

  try {
    const userInfo = await authService.googleCallback(code as string);

    let user = await userService.readByEmail(userInfo.email)

    if (!user) {
      user = await userService.create(userInfo.email, userInfo.image)
      // if (process.env.REGISTRATION_URL) {
      //   res.redirect(process.env.REGISTRATION_URL);
      // } else {
      //   console.log("Missing REGISTRATION_URL")
      //   res.status(500).send()
      // }
    }
    
    const accessToken = await authService.generateAccessToken(user!.id);
    const refreshToken = await authService.generateRefreshToken(user!.id);

    res.status(200).json({ access_token: accessToken, refresh_token: refreshToken })
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Google Auth failed' });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.get(refreshTokenHeader!);

  if (token) {
    try {
      const decodedToken = authService.verifyRefreshToken(token);
      
      const tokenStore = await authService.readRefreshToken(decodedToken.id)
      if (!tokenStore || tokenStore.revoked) {
        console.log("Invalid refresh token")
        res.status(500).send()
      }

      // sync delete, if failed dont continue
      await authService.deleteRefreshToken(decodedToken.id)
      const accessToken = authService.generateAccessToken(decodedToken.userId);
      const refreshToken = await authService.generateRefreshToken(decodedToken.userId);

      res.status(200).json({ access_token: accessToken, refresh_token: refreshToken })
    } catch(err) {
      console.log("Token verification failed", err)
      res.status(500).send()
    }
  } else {
    res.status(401).send()
  }
}