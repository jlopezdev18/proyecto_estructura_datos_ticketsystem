import { Response } from 'express';

export function handleError(res: Response, error: unknown, status = 500): void {
  if (error instanceof Error) {
    res.status(status).json({ error: error.message });
  } else {
    res.status(status).json({ error: 'An unknown error occurred' });
  }
}