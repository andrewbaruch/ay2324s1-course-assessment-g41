import postgresClient from '@/clients/postgres'; 
import { Language, Topic } from '@/models/user'; // Replace with the actual import path to your interfaces

class ResourceService {
  async getAllLanguages(): Promise<Language[]> {
    try {
      const sql = 'SELECT * FROM languages';
      const result = await postgresClient.query<Language>(sql);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getAllTopics(): Promise<Topic[]> {
    try {
      const sql = 'SELECT * FROM topics';
      const result = await postgresClient.query<Topic>(sql);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

const resourceService = new ResourceService();
export default resourceService;