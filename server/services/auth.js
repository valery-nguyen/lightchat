const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const key = require("../../config/keys").secretOrKey;

const validateSignupInput = require("../validation/signup");
const validateLoginInput = require("../validation/login");

const signup = async data => {
  try {
    const { message, isValid } = validateSignupInput(data);

    if (!isValid) {
      throw new Error(message);
    }

    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(
      {
        name,
        email,
        password: hashedPassword
      },
      err => {
        if (err) throw err;
      }
    );

    user.save();

    const token = jwt.sign({ id: user._id }, key);
    const _id = user._id;

    return { token, loggedIn: true, ...user._doc, password: null, _id };
  } catch (err) {
    throw err;
  }
};

const login = async data => {
  try {
    const { message, isValid } = validateLoginInput(data);

    if (!isValid) {
      throw new Error(message);
    }

    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("This user does not exist");

    const _id = user._id;

    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) throw new Error("Invalid password");

    const token = jwt.sign({ id: user.id }, key);

    return { token, loggedIn: true, ...user._doc, password: null, _id };
  } catch (err) {
    throw err;
  }
};

const verifyUser = async data => {
  try {
    const { token } = data;
    const decoded = await jwt.verify(token, key);
    const { id } = decoded;

    let _id = null;
    const loggedIn = await User.findById(id).then(user => {
      _id = user._id;
      return user ? true : false;
    });
    return { loggedIn, _id };
  } catch (err) {
    return { loggedIn: false, _id: null };
  }
};

module.exports = { signup, login, verifyUser };