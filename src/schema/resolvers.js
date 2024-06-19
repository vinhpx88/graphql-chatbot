import User from '../models/User.js';
import Question from '../models/Question.js';
import Group from '../models/Group.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { askSth } from '../ai-service/lm.js';

const generateAnswer = async (question)  => {

  return await askSth(question);
  // if (question.toLowerCase().includes('hello')) {
  //   return 'Hello! How can I help you?';
  // } else if (question.toLowerCase().includes('bye')) {
  //   return 'Goodbye! Have a nice day!';
  // } else {
  //   return 'This is a default answer to your question.';
  // }
};

const generateToken = (user) => {
return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
});
};

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: async (_, __, { user, error }) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await User.find().populate('groups')
    },
    user: async (_, { id }, { user, error }) => { 
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await User.findById(id).populate('groups')
    },

    questions: async (_, __, { user, error }) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await Question.find().populate('group').populate('user')
    },
    question: async (_, { id }, {user, error}) => { 
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await Question.findById(id).populate('group').populate('user')
    },
    groups: async (_, __, { user, error }) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await Group.find().populate('questions').populate('user')
    },
    group: async (_, { id }, {user, error}) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      return await Group.findById(id).populate('questions').populate('user') 
    },
    groupsByUser: async (_, { userId }, {user, error}) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      const groups = await Group.find({ user: userId }).populate('questions').populate('user');
      return groups;
    }
  },
  Mutation: {
    createUser: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      const token = generateToken(newUser);
      return { id: newUser.id, email: newUser.email, token };
    },
    postQuestion: async (_, { question, groupId }, {user, error}) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');

      const group = await Group.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const answer = await generateAnswer(question);

      const newQuestion = new Question({ question, answer, group });
      await newQuestion.save();
      group.questions.push(newQuestion);
      await group.save();
      return newQuestion;
    },
    createGroup: async (_, { name, userId }, {user, error}) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');

      const userdb = await User.findById(user);
      if (!userdb) {
        throw new Error('User not found');
      }

      const group = new Group({ name, user });
      await group.save();
      userdb.groups.push(group);
      await userdb.save();
      return group;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Incorrect password',
        };
      }

      const token = generateToken(user);
      return {
        success: true,
        message: 'Login successful',
        token,
      };
    },
  },
};

export default resolvers;
