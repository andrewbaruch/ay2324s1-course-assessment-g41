import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import postgresClient from '@/clients/postgres'; 
import { User } from '@/models/user'
import { PoolClient } from 'pg';

interface Payload extends jwt.JwtPayload {
    userId: string
}

export class AuthService {
    private googleClient
    private jwtSecret

    constructor() {
        this.googleClient = new google.auth.OAuth2(
            process.env.OAUTH_GOOGLE_CLIENT,
            process.env.OAUTH_GOOGLE_SECRET,
            process.env.AUTH_DOMAIN + '/auth/google/callback' 
        );

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.log("Missing JWT_SECRET")
            process.exit()
        }

        this.jwtSecret = secret
    }

    generateToken(userId: string): string {
        const payload = { userId };
        return jwt.sign({ data: payload }, this.jwtSecret, { expiresIn: '3d' });
    }

    verifyToken(token: string): Payload {
        const decoded = jwt.verify(token, this.jwtSecret) as Payload; 
        return decoded;
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
    
    async registerUsername(username: string, password: string, partialUser: Partial<User>): Promise<string> {
        var conn: PoolClient = await postgresClient.getConnection()

        try {
            await conn.query('BEGIN');
        
            const userQuery = 'INSERT INTO users (username, name, email, image) VALUES ($1, $2, $3, $4) RETURNING user_id';
            const userValues = [username, partialUser.name, partialUser.email, partialUser.image];
            const userResult = await conn.query(userQuery, userValues);
        
            const userId = userResult.rows[0].user_id;
        
            const credentialQuery = 'INSERT INTO credentials (username, password, user_id) VALUES ($1, $2, $3)';
            const credentialValues = [username, password, userId];
            await conn.query(credentialQuery, credentialValues);
        
            await conn.query('COMMIT');
        
            conn.release();
        
            return userId; 
        } catch (error) {
            // TODO: handle rollback fail
            await conn.query('ROLLBACK');
            console.error('Error registering username:', error);
            return "null"; 
        }
    }
    
    async checkCredentials(username:string, password: string) {
        try {
            const query = 'SELECT user_id FROM credentials WHERE username = $1 AND password = $2';
            const res = await postgresClient.query(query, [username, password]);

            if (res.rows.length === 1) {
            return res.rows[0].user_id; 
            } else {
            return ""; 
            }
        } catch (error) {
            throw error;
        }
    }
    
    async deleteCredential(userId: string) {
        try {  
            const query = 'DELETE FROM credentials WHERE user_id = $1';
            await postgresClient.query(query, [ userId ]);
        
            return true;
        } catch (error) {
            return false;
        }
    }
}

const authService = new AuthService();

export default authService;