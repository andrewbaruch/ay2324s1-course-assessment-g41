import { Request, Response } from 'express';
import { User } from '@/models/user'
import userService from '@/services/user-service'; 

export async function getCurrentUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    console.log("getCurrentUser: " + userId)

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(200).json(user);
        } 

        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(200).json(user);
        } 

        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    const updatedUser = req.body as Partial<User>; // Partial to allow updating only specific fields
    try {
        await userService.update(userId, updatedUser);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        await userService.delete(userId);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

