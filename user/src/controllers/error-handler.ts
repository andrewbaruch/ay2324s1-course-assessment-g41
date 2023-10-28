import * as errors from '@/services/service-errors'; 
import { Response } from 'express';
import { OAuthError } from './auth-controller';
import { StatusCodes } from 'http-status-codes';

export function handleServiceError(err: any, res: Response): void {
    if (err instanceof errors.BadRequestError) {
        res.status(StatusCodes.BAD_REQUEST);
    } else if (err instanceof errors.DataNotFoundError) {
        res.status(StatusCodes.NOT_FOUND);
    } else if (err instanceof errors.DatabaseError) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    } else if (err instanceof OAuthError) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

