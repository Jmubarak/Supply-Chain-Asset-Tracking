// productCategoryValidator.ts

import { Request, Response, NextFunction } from 'express';

export const validateCategoryCreation = (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.body;

    if (!categoryName || typeof categoryName !== 'string') {
        return res.status(400).json({ message: 'Invalid category data.' });
    }

    next();
};

export const validateCategoryId = (req: Request, res: Response, next: NextFunction) => {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId) || categoryId <= 0) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    next();
};
