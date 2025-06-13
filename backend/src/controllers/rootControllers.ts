import { Request, Response } from 'express';


export const rootController = (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to the API',
        status: 'success',
        data: {
            name: 'Express API Starter',
            version: '1.0.0'
        }
    });
};