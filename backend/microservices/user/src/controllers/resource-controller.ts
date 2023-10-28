import { Request, Response } from 'express';
import { User } from '@/models/user'
import resourceService from '@/services/resource-service'; 

export async function getTopics(req: Request, res: Response) {
    try {
        const topics = await resourceService.getAllTopics()
        res.status(200).json(topics);
    } catch(error) {
        res.status(500).send();

    }
}

export async function getLanguages(req: Request, res: Response) {
    try {
        const languages = await resourceService.getAllLanguages()
        res.status(200).json(languages);

    } catch(error) {
        res.status(500).send();

    }
}