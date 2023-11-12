import { getAllAttemptsByUser } from "../../../src/services/history";
const AttemptList = async () => {
  const userAttempts = await getAllAttemptsByUser()
  console.log(userAttempts);
  return <div>Attempt world</div>
}

export default AttemptList;