const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      email,
      passwordHash,
    });
  }

  static async signIn({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User does not exist.');

    const correctPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!correctPassword) throw new Error('Invalid credentials.');

    return user;
  }
};
