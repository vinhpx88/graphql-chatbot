import User from '../models/User.js';
import Question from '../models/Question.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateAnswer = (question) => {
  if (question.toLowerCase().includes('hello')) {
    return 'Hello! How can I help you?';
  } else if (question.toLowerCase().includes('bye')) {
    return 'Goodbye! Have a nice day!';
  } else {
    return 'This is a default answer to your question.';
  }
};

const generateToken = (user) => {
return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
});
};

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: async () => await User.find().populate('questions'),
    user: async (_, { id }) => await User.findById(id).populate('questions'),
  },
  Mutation: {
    createUser: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      const token = generateToken(newUser);
      return { id: newUser.id, email: newUser.email, token };
    },
    postQuestion: async (_, { userId, question }, { user, error }) => {
      if (error) throw new Error(error);
      if (!user) throw new Error('Not authenticated');
      if (!user) {
        throw new Error('Not authenticated');
      }
      const answer = generateAnswer(question);
      const newQuestion = new Question({ question, answer, author: user.id });
      await newQuestion.save();
      user.questions.push(newQuestion);
      await user.save();
      return newQuestion.populate('author');
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
