import { ProductCategory } from '../src/entity/ProductCategory';
import { AppDataSource } from '../src/data-source'; 

class ProductCategoryService {
    // Fetch all categories for a specific user
    static async getAllCategoriesByUserId(userId: number): Promise<ProductCategory[]> {
        try {
            return await AppDataSource.getRepository(ProductCategory).find({ where: { user: { userID: userId } } });
        } catch (error) {
            console.error("Database error during categories fetch:", error);
            throw new Error('Failed to fetch categories. Please try again later.');
        }
    }

    static async getCategoryById(categoryId: number): Promise<ProductCategory | null> {
        try {
            const category = await AppDataSource.getRepository(ProductCategory).findOne({ where: { categoryID: categoryId } });
            return category || null;
        } catch (error) {
            console.error("Database error during category fetch:", error);
            throw new Error('Failed to fetch category. Please try again later.');
        }
    }

    // Ensure that when a category is created, the user association is also set.
    static async createCategory(userId: number, categoryData: Partial<ProductCategory>): Promise<ProductCategory> {
        try {
            const categoryRepository = AppDataSource.getRepository(ProductCategory);

            // Assigning user to the category data
            categoryData.user = { userID: userId } as any;

            const category = categoryRepository.create(categoryData);
            return await categoryRepository.save(category);
        } catch (error) {
            console.error("Database error during category creation:", error);
            throw error;
        }
    }

    static async updateCategory(categoryId: number, updatedCategoryData: Partial<ProductCategory>): Promise<ProductCategory | null> {
        try {
            const categoryRepository = AppDataSource.getRepository(ProductCategory);
            const result = await categoryRepository.update(categoryId, updatedCategoryData);
            if (result.affected !== 1) {
                return null;
            }
            return await categoryRepository.findOne({ where: { categoryID: categoryId } });
        } catch (error) {
            console.error("Database error during category update:", error);
            throw new Error('Failed to update category. Please try again later.');
        }
    }

    static async deleteCategory(categoryId: number): Promise<boolean> {
        try {
            const categoryRepository = AppDataSource.getRepository(ProductCategory);
            const result = await categoryRepository.delete(categoryId);
            if (!result.affected) {
                throw new Error('Category not found');
            }
            return true;
        } catch (error) {
            console.error("Database error during category deletion:", error);
            throw new Error('Failed to delete category. Please try again later.');
        }
    }
}

export default ProductCategoryService;
