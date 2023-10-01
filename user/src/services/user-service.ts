import postgresClient from '@/clients/postgres'; 
import { User } from '@/models/user'

class UserService {
  async create(user: User): Promise<User> {
    try {
        const query =
          'INSERT INTO users (id, name, email, image) VALUES ($1, $2, $3, $4)';

        const result = await postgresClient.query<User>(query, [
            user.id,
            user.name,
            user.email,
            user.image,
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
        // 'UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4';

        'UPDATE users SET \
          name = COALESCE($1, name), \
          email = COALESCE($2, email), \
          image = COALESCE($3, image), \
        WHERE id = $4';
        
      await postgresClient.query(query, [
        updatedUser.name ?? null,
        updatedUser.email ?? null,
        updatedUser.image ?? null,
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

