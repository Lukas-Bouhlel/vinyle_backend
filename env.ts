import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).default(3000),
  MONGO_CLUSTER: z.string().min(1),
  MONGO_DATABASE: z.string().min(1),
  MONGO_USER: z.string().min(1),
  MONGO_PWD: z.string().min(1),
  API_DEFAUT_LIMIT: z.coerce.number().min(1).default(50),
  JWT_SECRET: z.string().min(12),
});

// Validate `process.env` against our schema
// and return the result
// eslint-disable-next-line node/no-process-env
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export default env;
