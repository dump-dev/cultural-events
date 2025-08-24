import TestAgent from "supertest/lib/agent";
import request from "supertest/lib/agent";

type User = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async (testAgent: TestAgent, user: User) =>
  testAgent.post("/users").send(user);

export const loginUser = async (
  testAgent: TestAgent,
  credentials: Omit<User, "name">
) => testAgent.post("/auth/login").send(credentials);

export async function createAndLoginUser(testAgent: TestAgent, user: User) {
  await registerUser(testAgent, user);
  const response = await loginUser(testAgent, user);
  return response.body;
}
