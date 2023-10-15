import postgresClient from '@/clients/postgres'; 
import { User, Topic } from '@/models/user'
import { UserDao } from '@/db_models/user-dao'

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
      const query = `
        SELECT users.*, languages.name AS preferred_language_name
        FROM users
        LEFT JOIN languages ON users.preferred_language = languages.id
        WHERE users.id = $1
      `;

      const userResult = await postgresClient.query<UserDao & { preferred_language_name: string }>(query, [userId]);

      if (!userResult.rows || userResult.rows.length === 0) {
        return null;
      }

      const user: User = {
        ...userResult.rows[0],
        preferred_language: userResult.rows[0].preferred_language_name,
        preferred_topics: [],
      };

      const topicsQuery = `
        SELECT topics.*
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;

      const topicsResult = await postgresClient.query<Topic>(topicsQuery, [userId]);

      if (topicsResult.rows) {
        user.preferred_topics = topicsResult.rows;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async readByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT users.*, languages.name AS preferred_language_name
        FROM users
        LEFT JOIN languages ON users.preferred_language = languages.id
        WHERE users.email = $1
      `;

      const userResult = await postgresClient.query<User & { preferred_language_name: string }>(query, [email]);

      if (!userResult.rows || userResult.rows.length === 0) {
        return null;
      }

      const user: User = {
        ...userResult.rows[0],
        preferred_language: userResult.rows[0].preferred_language_name,
        preferred_topics: [],
      };

      const topicsQuery = `
        SELECT topics.*
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;

      const topicsResult = await postgresClient.query<Topic>(topicsQuery, [user.id]);

      if (topicsResult.rows) {
        user.preferred_topics = topicsResult.rows;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async readMulti(userIds: string[]): Promise<User[]> {
    try {
      const users: User[] = [];
  
      for (const userId of userIds) {
        const user = await this.read(userId);
        if (user) {
          users.push(user);
        }
      }
  
      return users;
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
          preferred_difficulty = COALESCE($5, preferred_difficult), 
          preferred_topics = COALESCE($6, preferred_topics)
        WHERE id = $7`;
        
      await postgresClient.query(query, [
        updatedUser.name ?? null,
        updatedUser.email ?? null,
        updatedUser.image ?? null,
        updatedUser.preferred_language ?? null,
        updatedUser.preferred_difficulty ?? null,
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

  async readTopics(userId: string): Promise<Topic[]> {
    try {
      const query = `
        SELECT topics.id, topics.name, topics.slug, topics.description
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;
      const result = await postgresClient.query<Topic>(query, [userId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async addTopics(userId: string, topicSlugs: string[]): Promise<void> {
    try {
      const topicIds = await this.getTopicIdsBySlugs(topicSlugs);

      if (topicIds.length > 0) {
        const query = `
          INSERT INTO user_topic (user_id, topic_id)
          VALUES 
            ${topicIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
        `;
        await postgresClient.query(query, [userId, ...topicIds]);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteTopics(userId: string, topicSlugs: string[]): Promise<void> {
    try {
      const topicIds = await this.getTopicIdsBySlugs(topicSlugs);

      if (topicIds.length > 0) {
        const query = `
          DELETE FROM user_topic
          WHERE user_id = $1 AND topic_id IN (${topicIds.map((_, i) => `$${i + 2}`).join(', ')})
        `;
        await postgresClient.query(query, [userId, ...topicIds]);
      }
    } catch (error) {
      throw error;
    }
  }

  async getTopicIdsBySlugs(slugs: string[]): Promise<string[]> {
    try {
      const query = `
        SELECT id
        FROM topics
        WHERE slug IN (${slugs.map((_, i) => `$${i + 1}`).join(', ')})
      `;
      const result = await postgresClient.query<{ id: string }>(query, slugs);

      return result.rows.map((row) => row.id);
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();

export default userService;

