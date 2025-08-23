import TestAgent from "supertest/lib/agent";
import request from "supertest/lib/agent";

type User = {
  name: string;
  email: string;
  password: string;
};

export default async function createAndLoginUser(testAgent: TestAgent, user: User) {
  await testAgent.post("/users").send(user);
  return testAgent
    .post("/auth/login")
    .send({ email: user.email, password: user.password });
}
