import User from '../repositories/user.repository.ts';
import type IUser from '../interfaces/IUser.ts';
import bcrypt from 'bcrypt';
import JwtService from './jwt.service.ts';

class AuthService {
  // -------------------
  // Register service
  // -------------------
  async registerService(
    username: string,
    password: string,
    role: 'regular' | 'admin' = 'regular',
  ) {
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
    const salt: string = await bcrypt.genSalt(10);
    const hashedPass: string = await bcrypt.hash(password, salt);

    // Create new user with role
    const createdUser = await User.createUser(username, hashedPass, role);

    if (!createdUser) {
      return {
        success: false,
        message: 'Failed to create user',
      };
    }

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
    const user: IUser | null = await User.findUserByUsername(username);
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Compare password
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid username or password',
      };
    }

    const accessToken: string = JwtService.generateAccessToken({
      id: user.id,
      username: user.username,
    });
    const refreshToken: string = JwtService.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username },
    };
  }

  // -------------------
  // Refresh token service
  // -------------------
  async refreshTokenService(refreshToken: string) {
    try {
      const decoded = JwtService.validateRefreshToken(refreshToken);

      // Generate new access token
      const user = await User.findUserById(decoded.id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const newAccessToken = JwtService.generateAccessToken({
        id: user.id,
        username: user.username,
        role: user.role || 'regular',
      });

      return {
        success: true,
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Invalid or expired refresh token',
      };
    }
  }
}

export default new AuthService();
