import { Socket } from 'socket.io';
import cookie from 'cookie';
import authService from '@/services/auth-service'; // Adjust the import path as needed

const accessTokenKey = process.env.ACCESS_COOKIE_KEY || '';

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): void {
  try {
    const handshakeData = socket.request;
    // Parse cookies from the handshake headers
    const cookies = cookie.parse(handshakeData.headers.cookie || '');
    const token = cookies[accessTokenKey];

    if (token) {
      // Verify the token
      const decoded = authService.verifyAccessToken(token); // Adjust based on how you verify tokens
      // Attach the user ID to the socket object for later use
      (socket as any).userId = decoded.userId;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  } catch (error) {
    next(new Error('Authentication error'));
  }
}
