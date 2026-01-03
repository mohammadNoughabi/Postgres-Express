import User from '../repositories/user.repository.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/envVariables.ts';

class AuthService {
  constructor() {}

  // -------------------
  // Register service
  // -------------------
  async registerService(username: string, password: string) {
    // Check if user exists
    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      return {
        success: false,
        message:
          'Username already exists. choose another username and try again',
      };
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User(username, hashedPass);
    const createdUser = await user.createUser();

    return {
      success: true,
      message: 'User registered successfully',
      user: createdUser,
    };
  }

  // -------------------
  // Login service
  // -------------------
  async loginService(username: string, password: string) {
    const user = await User.findUserByUsername(username);
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid username or password',
      };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      ENV.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username },
    };
  }

  // -------------------
  // Logout service
  // -------------------
  async logoutService() {
    return { success: true, message: 'Logout successful' };
  }
}

export default new AuthService();
