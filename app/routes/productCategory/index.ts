import express from 'express';
import ProductCategoryController from './controller';
import { validateCategoryCreation, validateCategoryId } from '../../middleware/productCategoryValidators';
import validateToken from '../../middleware/validateToken';
const router = express.Router();

// Get all categories
router.get('/', validateToken, ProductCategoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', validateToken, validateCategoryId, ProductCategoryController.getCategoryById);

// Create a new category
router.post('/', validateToken, validateCategoryCreation, ProductCategoryController.createCategory);

// Update a category by ID
router.put('/:id', validateToken, validateCategoryId, validateCategoryCreation, ProductCategoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', validateToken, validateCategoryId, ProductCategoryController.deleteCategory);

export default router;
