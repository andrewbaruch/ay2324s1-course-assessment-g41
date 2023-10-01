import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { response } from 'express';

interface Payload extends jwt.JwtPayload {
    userId: string
}

export class AuthService {
    private googleClient

    constructor() {
        this.googleClient = new google.auth.OAuth2(
            process.env.OAUTH_GOOGLE_CLIENT,
            process.env.OAUTH_GOOGLE_SECRET,
            process.env.AUTH_DOMAIN + '/auth/google/callback' 
          );
    }

    generateToken(userId: string): string {
        const payload = { userId };
        return jwt.sign({ data: payload }, process.env.JWT_SECRET || "DEV_JWT", { expiresIn: '3d' });
    }

    verifyToken(token: string): Payload {
        const decoded = jwt.verify(token, process.env.JWT || 'DEV_JWT') as Payload; 
        return decoded;
    }

    async authenticateUserUsername(username: string, password: string): Promise<string> {
        // TODO: login check
        if (username === 'user' && password === 'password') {
            const userId = "uid"
            return userId;
        } else {
            throw Error;
        }
    }

    getGoogleAuthURL() {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        return this.googleClient.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });
    }

    async googleCallback(code: string) {
        try {
            const tokenResp = await this.googleClient.getToken(code)
            await this.googleClient.setCredentials(tokenResp.tokens)
            const credentials = this.googleClient.credentials

            const accessToken = credentials.access_token
            const res =  await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${accessToken}`)
            const data = await res.json();
            return data
        } catch(err) {
            console.log("Google callback failed")
        }
    }

}

const authService = new AuthService();

export default authService;