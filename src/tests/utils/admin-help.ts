import TestAgent from "supertest/lib/agent";
import { loginUser } from "./user-helper";

export const loginAdmin = async (testAgent: TestAgent) => {
  const credentials = {
    email: process.env.SEED_ADMIN_EMAIL as string,
    password: process.env.SEED_ADMIN_PASSWORD as string,
  };

  return loginUser(testAgent, credentials);
};

export const loginAdminAndReturnBody = async (testAgent: TestAgent) => {
  const respnse = await loginAdmin(testAgent);
  return respnse.body;
};
