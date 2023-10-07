import postgresClient from '@/clients/postgres'; 
import { User } from '@/models/user'

class UserService {
  async create(email: string, image: string): Promise<User> {
    try {
        const query =
          'INSERT INTO users (email, image) VALUES ($1, $2) RETURNING *;';

        const result = await postgresClient.query<User>(query, [
          email,
          image,
        ]);

        if (!result.rows) {
          throw Error;
        }
        
        return result.rows[0]
    } catch (error) {
        throw error;
    }
  }

  async read(userId: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await postgresClient.query<User>(query, [userId]);
      
      if (!result.rows) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async readByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await postgresClient.query<User>(query, [email]);
      
      if (!result.rows) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async readMulti(userIds: string[]): Promise<User[]> {
    try {
      const query = `SELECT * FROM users WHERE id IN (${userIds.map((_, i) => `$${i + 1}`).join(', ')})`;
      const result = await postgresClient.query<User>(query, userIds);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async readAll(): Promise<User[]> {
    try {
      const query = 'SELECT * FROM users';
      const result = await postgresClient.query<User>(query);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, updatedUser: Partial<User>): Promise<void> {
    try {
      const query =
        `UPDATE users SET 
          name = COALESCE($1, name), 
          email = COALESCE($2, email), 
          image = COALESCE($3, image), 
          preferred_language = COALESCE($4, preferred_language), 
          preferred_difficult = COALESCE($5, preferred_difficult), 
          preferred_topics = COALESCE($6, preferred_topics)
        WHERE id = $7`;
        
      await postgresClient.query(query, [
        updatedUser.name ?? null,
        updatedUser.email ?? null,
        updatedUser.image ?? null,
        updatedUser.preferred_language ?? null,
        updatedUser.preferred_difficult ?? null,
        updatedUser.preferred_topics ?? null,
        userId,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await postgresClient.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();

export default userService;

