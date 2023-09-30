import { Request, Response } from 'express';
import { User } from '@/models/user'
import userService from '@/services/user-service'; 

export async function createUser(req: Request, res: Response) {
    const newUser = req.body as User; 
    try {
        await userService.create(newUser);
        res.status(200);
    } catch (error) {
        res.status(500);
    }
}

export async function getCurrentUser(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
        const user = await userService.read(userId);
        if (user) {
        res.status(200).json(user);
        } 
    } catch (error) {
        res.status(500);
    }
}

export async function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
        res.status(200).json('hi')
        const user = await userService.read(userId);
        if (user) {
            res.status(200).json(user);
        } 
    } catch (error) {
        res.status(500);
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const updatedUser = req.body as Partial<User>; // Partial to allow updating only specific fields
    try {
        await userService.update(userId, updatedUser);
        res.status(200);
    } catch (error) {
        res.status(500);
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
        await userService.delete(userId);
        res.status(200);
    } catch (error) {
        res.status(500);
    }
}

