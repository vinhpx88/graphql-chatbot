import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import connectDB from './src/db.js';
import typeDefs from './src/schema/typeDefs.js';
import resolvers from './src/schema/resolvers.js';
import auth from './src/middleware/auth.js';
import { initialize } from './src/ai-service/lm.js';

dotenv.config();

// Connect to MongoDB
connectDB();

// init language model
initialize();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => auth(req),
  });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
