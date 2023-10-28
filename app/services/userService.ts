import bcrypt from 'bcrypt';
import { User } from '../src/entity/User';
import { AppDataSource } from '../src/data-source'; 
import jwt from 'jsonwebtoken';

class UserService {
  
  // method to create a new user
  static async createUser(userData: Partial<User>): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password!, 10);

      // Get the User repository using AppDataSource
      const userRepository = AppDataSource.getRepository(User);

      // Create a new user in the database with the hashed password and the rest of the user data
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      return await userRepository.save(user);
      
    } catch (error) {
      console.error("Database error during signup:", error);

      // Handle the unique constraint error if email is already in use
      if (error.code === 'ER_DUP_ENTRY') { // This is the MySQL unique violation error code.
        throw new Error('Email already in use');
      }
      
      throw new Error('Failed to sign up. Please try again later.');
    }
  }

  // method to update a user
  static async updateUser(userId: number, updatedUserData: Partial<User>): Promise<User | null> {
    if ('email' in updatedUserData || 'password' in updatedUserData) {
      throw new Error('Request Body contains data that is not allowed on this route.');
    }
    
    try {
      const userRepository = AppDataSource.getRepository(User);

      // Update user in the database with the new user data
      const result = await userRepository.update(userId, updatedUserData);

      if (result.affected !== 1) {
        return null; // If no rows were updated, return null
      }
      
      // Return the updated user
      const updatedUser = await userRepository.findOne({
        where: { userID: userId }
      });
      

      return updatedUser || null;

    } catch (error) {
      console.error("Database error during user update:", error);
      throw new Error('Failed to update user. Please try again later.');
    }
  }
  static async loginUser(email: string, password: string) {
    // Get the User repository
    const userRepository = AppDataSource.getRepository(User);

    // Use TypeORM method to find a user by email
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload = { userId: user.userID, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: process.env.TOKEN_EXPIRATION });

    return { user, token };
  }


// Method to fetch a user by ID
static async fetchUserById(userId: number): Promise<User | null> {
    try {
      // Get the User repository
      const userRepository = AppDataSource.getRepository(User);
  
      // Use TypeORM's findOne method to get a user by ID
      const user = await userRepository.findOne({ where: { userID: userId } });
  
      return user || null;
  
    } catch (error) {
      console.error("Database error during user fetch:", error);
      throw new Error('Failed to fetch user. Please try again later.');
    }
  }
  



  //method to delete user
  static async deleteUser(userId: number) {
    // Get the User repository
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Use TypeORM method to delete a user by ID
      const result = await userRepository.delete({ userID: userId });

      if (!result.affected) {
        throw new Error('User not found');
      }

      return true; // Return true to indicate successful deletion.

    } catch (error) {
      console.error("Database error during user deletion:", error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  }
  //method to change password
  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get the User repository
    const userRepository = AppDataSource.getRepository(User);

    // Find user by ID
    const user = await userRepository.findOne({ where: { userID: userId } });

    if (!user) {
      throw new Error('User not found.');
    }

    // Verify the current password matches the one in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new Error('Incorrect current password');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await userRepository.save(user);

    return true;
  }
  //method to change email
  static async changeEmail(userId: number, newEmail: string, password: string): Promise<boolean> {
    // Get the User repository
    const userRepository = AppDataSource.getRepository(User);

    // Find user by ID
    const user = await userRepository.findOne({ where: { userID: userId } });

    if (!user) {
      throw new Error('User not found.');
    }

    // Verify that the provided password matches the one in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password.');
    }

    // Check if newEmail is already in use
    const existingUser = await userRepository.findOne({ where: { email: newEmail } });
    if (existingUser) {
      throw new Error('The new email is already in use.');
    }

    // Update the user's email in the database
    user.email = newEmail;
    await userRepository.save(user);

    return true;
  }

  
}

export default UserService;
