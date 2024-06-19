import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    groups: [Group!]
  }

  type Group {
    id: ID!
    name: String!
    questions: [Question!]
    user: User!
  }

  type Question {
    id: ID!
    question: String!
    answer: String!
    group: Group!
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
    questions: [Question!]!
    question(id: ID!): Question
    groups: [Group!]!
    group(id: ID!): Group
    groupsByUser(userId: ID!): [Group!]!
  }

  type Mutation {
    createUser(email: String!, password: String!): CreateUserResponse
    login(email: String!, password: String!): LoginResponse
    postQuestion(question: String!, groupId: ID!): Question
    createGroup(name: String!, userId: ID!): Group
  }
`;

export default typeDefs;
