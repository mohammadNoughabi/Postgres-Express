import { pool } from '../config/db.ts';
import type IUser from '../interfaces/IUser.ts';
import { v4 as uuidv4 } from 'uuid';

class User implements IUser {
  readonly id: string;
  username: string;
  password: string;

  constructor(username: string, password: string, id: string = uuidv4()) {
    this.id = id;
    this.username = username;
    this.password = password;
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
}

export default User;
