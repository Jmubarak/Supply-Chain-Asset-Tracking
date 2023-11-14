import { Router } from 'express';
import ProductController from './controller';
import { productValidators } from '../../middleware/productValidators';
import validateToken from '../../middleware/validateToken';

const router = Router();

// Ensure user is authenticated before accessing any of these routes
router.use(validateToken);

// Routes aligned to the controller methods
router.get('/', ProductController.getAllProducts); // Fetches products based on authenticated user's ID
router.get('/:id', ProductController.getProductById); // Fetches product by its ID and authenticated user's ID
router.post('/', productValidators, ProductController.createProduct); // Creates a product associated with authenticated user's ID
router.put('/:id', productValidators, ProductController.updateProduct); // Updates a product by its ID and authenticated user's ID
router.delete('/:id', ProductController.deleteProduct); // Deletes a product by its ID and authenticated user's ID

export default router;
