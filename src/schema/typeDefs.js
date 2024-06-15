import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    questions: [Question]
  }

  type Question {
    id: ID!
    question: String!
    answer: String!
    author: User
  }

  type QuestionResponse {
    question: String!
    answer: String!
  }

  type LoginResponse {
    success: Boolean!
    message: String
    token: String
  }

  type CreateUserResponse {
    id: ID!
    email: String!
    token: String
  }

  type Query {
    hello: String
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(email: String!, password: String!): CreateUserResponse
    postQuestion(userId: ID!, question: String!): Question
    login(email: String!, password: String!): LoginResponse
  }
`;

export default typeDefs;
