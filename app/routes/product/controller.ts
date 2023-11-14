import { Request, Response, NextFunction } from 'express';
import ProductService from '../../services/productService';
import {UserRequest} from '../../interfaces/userRequest'


class ProductController {

    async createProduct(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.createProduct(req.user.userId, req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const products = await ProductService.getAllProductsByUserId(req.user.userId);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.getProductByIdAndUserId(Number(req.params.id), req.user.userId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.updateProduct(Number(req.params.id), req.user.userId, req.body);
            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const deleted = await ProductService.deleteProduct(Number(req.params.id), req.user.userId);
            if (deleted) {
                res.json({ message: 'Product deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Product not found.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
