const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const User = require("./models/user");
const Author = require("./models/author");

function isInputErroneous(args) {
  if (args.author.length < 4) {
    throw new GraphQLError("Author name is too short", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.author,
      },
    });
  } else if (args.title.length < 5) {
    throw new GraphQLError("Title is too short", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.title,
      },
    });
  } else if (args.published < 0 || args.published > new Date().getFullYear()) {
    throw new GraphQLError("Year cannot be negative or exceed current year", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.published,
      },
    });
  }
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const bookAuthor = await Author.findOne({ name: args.author });
        return await Book.find({
          genres: args.genre,
          author: bookAuthor._id,
        }).populate("author");
      } else if (args.author) {
        const bookAuthor = await Author.findOne({ name: args.author });
        return await Book.find({ author: bookAuthor._id }).populate("author");
      } else if (args.genre) {
        return await Book.find({ genres: args.genre }).populate("author");
      } else {
        return await Book.find({}).populate("author");
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (isInputErroneous(args)) {
        return null;
      }

      const bookAuthor = await Author.findOne({ name: args.author });
      let newBook = null;

      if (!bookAuthor) {
        const newAuthor = new Author({ name: args.author, born: null });
        await newAuthor.save();
        newBook = new Book({ ...args, author: newAuthor._id });
      } else {
        newBook = new Book({ ...args, author: bookAuthor._id });
      }
      newBook = await newBook.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

      return newBook.save();
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true, runValidators: true, context: "query" }
      );
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "spaghetti") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },

  Author: {
    bookCount: async (root, context, contextValue) => {
      return contextValue.loaders.bookCountLoader.load(root._id);
      return await Book.count({ author: root._id });
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
