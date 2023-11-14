import { Product } from '../src/entity/Product';
import { AppDataSource } from '../src/data-source';

class ProductService {
  
  static async createProduct(userId: number, productData: Partial<Product>): Promise<Product> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      
      // Associate the product with a user
      productData.user = { userID: userId } as any;

      const product = productRepository.create(productData);
      return await productRepository.save(product);
    } catch (error) {
      console.error("Database error during product creation:", error);
      throw new Error('Failed to create product. Please try again later.');
    }
  }

  static async getAllProductsByUserId(userId: number): Promise<Product[]> {
    try {
      return await AppDataSource.getRepository(Product).find({ where: { user: { userID: userId } } });
    } catch (error) {
      console.error("Database error during products fetch:", error);
      throw new Error('Failed to fetch products. Please try again later.');
    }
  }

  static async getProductByIdAndUserId(productId: number, userId: number): Promise<Product | null> {
    try {
      const product = await AppDataSource.getRepository(Product).findOne({ where: { productID: productId, user: { userID: userId } } });
      return product || null;
    } catch (error) {
      console.error("Database error during product fetch:", error);
      throw new Error('Failed to fetch product. Please try again later.');
    }
  }

  static async updateProduct(productId: number, userId: number, updatedProductData: Partial<Product>): Promise<Product | null> {
    try {
      // First, ensure the product belongs to the user
      const productExists = await ProductService.getProductByIdAndUserId(productId, userId);
      if (!productExists) {
        throw new Error('Product not found or unauthorized.');
      }

      const productRepository = AppDataSource.getRepository(Product);
      const result = await productRepository.update({ productID: productId, user: { userID: userId } as any }, updatedProductData);
      if (result.affected !== 1) {
        return null;
      }
      return await productRepository.findOne({ where: { productID: productId, user: { userID: userId } } });
    } catch (error) {
      console.error("Database error during product update:", error);
      throw new Error('Failed to update product. Please try again later.');
    }
  }

  static async deleteProduct(productId: number, userId: number): Promise<boolean> {
    try {
      // First, ensure the product belongs to the user
      const productExists = await ProductService.getProductByIdAndUserId(productId, userId);
      if (!productExists) {
        throw new Error('Product not found or unauthorized.');
      }

      const result = await AppDataSource.getRepository(Product).delete({ productID: productId, user: { userID: userId } as any });
      if (!result.affected) {
        throw new Error('Product not found');
      }
      return true;
    } catch (error) {
      console.error("Database error during product deletion:", error);
      throw new Error('Failed to delete product. Please try again later.');
    }
  }
}

export default ProductService;
