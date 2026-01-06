import { pool } from '../config/db.ts';
import type IUser from '../interfaces/IUser.ts';
import { v4 as uuidv4 } from 'uuid';

class User implements IUser {
  readonly id: string;
  username: string;
  password: string;
  role: 'regular' | 'admin';

  constructor(
    username: string,
    password: string,
    role: 'regular' | 'admin' = 'regular',
    id: string = uuidv4(),
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  // -----------------------
  // Delete user by id
  // -----------------------
  async deleteUser(): Promise<boolean> {
    try {
      const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING id;
    `;

      const result = await pool.query(query, [this.id]);

      if (typeof result.rowCount === 'number' && result.rowCount > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // -----------------------
  // Static : Create new user
  // -----------------------
  static async createUser(
    username: string,
    password: string,
    role: 'regular' | 'admin' = 'regular',
  ): Promise<IUser | null> {
    try {
      const id: string = uuidv4();
      const query = `
      INSERT INTO users (id , username , password , role)
      VALUES ($1 , $2 , $3 , $4)
      RETURNING (id , username , role);
      `;
      const result = await pool.query(query, [id, username, password, role]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // -----------------------
  // Static : Find user by username
  // -----------------------
  static async findUserByUsername(username: string): Promise<IUser | null> {
    try {
      const query = `
    SELECT id , username , password 
    FROM users
    WHERE username = $1
    `;

      const result = await pool.query(query, [username]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // -----------------------
  // Static : Find user by id
  // -----------------------
  static async findUserById(id: string): Promise<IUser | null> {
    try {
      const query = `
    SELECT id , username , password
    FROM users
    WHERE id = $1
    `;

      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // -----------------------
  // Static: Get user role by id
  // -----------------------
  static async getUserRoleById(id: string): Promise<string | null> {
    try {
      const query = `
      SELECT role
      FROM users 
      WHERE id = $1;
      `;

      const result = await pool.query(query, [id]);
      return result.rows[0]?.role || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default User;
