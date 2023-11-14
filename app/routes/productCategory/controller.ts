import { Request, Response, NextFunction } from 'express';
import ProductCategoryService from '../../services/productCategoryService';
import {UserRequest} from '../../interfaces/userRequest'


class ProductCategoryController {
    async getAllCategories(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.userId;
            const categories = await ProductCategoryService.getAllCategoriesByUserId(userId);
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await ProductCategoryService.getCategoryById(Number(req.params.id));
            if (!category) {
                return res.status(404).json({ message: 'Category not found.' });
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.userId;
            const category = await ProductCategoryService.createCategory(userId, req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await ProductCategoryService.updateCategory(Number(req.params.id), req.body);
            if (!category) {
                return res.status(404).json({ message: 'Category not found.' });
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            await ProductCategoryService.deleteCategory(Number(req.params.id));
            res.json({ message: 'Category deleted successfully.' });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductCategoryController();
