import jwt from "jsonwebtoken";

interface AccessPayload extends jwt.JwtPayload {
  userId: string
}

export const verifyAccessToken = (token: string, jwtSecret: string) => {
  // error will be thrown if jwt fails
  const decoded = jwt.verify(token, jwtSecret) as AccessPayload
  return decoded;
}

export const retrieveUserIdFromToken = (token: string, jwtSecret) => {
  const decodedPayload = verifyAccessToken(token, jwtSecret)
  return decodedPayload.userId;
}