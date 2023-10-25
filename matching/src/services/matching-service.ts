// import postgresClient from "@/clients/postgres";
import { MatchingPair } from "@/models/matching";
// import { Difficulty } from "@/models/question";

class MatchingService {
  // async read(userId: string): Promise<MatchingPair[] | null> {
  //         const matchingPairResult = await postgresClient.query<MatchingPair>(
  //       query,
  //       [userId]
  //     );
  //     if (!matchingPairResult.rows || matchingPairResult.rows.length === 0) {
  //       return null;
  //     }
  //     return matchingPairResult.rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  // async create(difficulty: Difficulty): Promise<MatchingPair> {}
  // async read(userId: string): Promise<MatchingPair[] | null> {
  //   try {
  //     const query = `
  //       SELECT *
  //       FROM matching_pairs
  //       WHERE user_id1 = $1
  //     `;
  //     const matchingPairResult = await postgresClient.query<MatchingPair>(
  //       query,
  //       [userId]
  //     );
  //     if (!matchingPairResult.rows || matchingPairResult.rows.length === 0) {
  //       return null;
  //     }
  //     return matchingPairResult.rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

const matchingService = new MatchingService();

export default matchingService;
