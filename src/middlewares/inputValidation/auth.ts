import * as joi from 'joi';
import { signupRequestSchema, loginRequestSchema } from '../../requestSchemas/auth';
import Exception from 'src/helpers/Exception';
import UserModel from 'src/resources/user/user.model';

const User = new UserModel();

/**
 * @export
 * @class AuthValidator
 */
class AuthValidator {
  /**
   * @param {Object} req - received request
   * @param {Object} res - response object
   * @param {Object} next - next middleware
   * @return {Object} - response
   */
  static async validateLogin(req, res, next) {
    try {
      await joi.validate(req.body, loginRequestSchema);
      next();
    } catch (err) {
      throw Exception.unprocessable(err);
    }
  }

  /**
   * @param {Object} req - received request
   * @param {Object} res - response object
   * @param {Object} next - next middleware
   * @return {Object} - response
   */
  static async validateSignup(req, res, next) {
    try {
      await joi.validate(req.body, signupRequestSchema);
      next();
    } catch (err) {
      throw Exception.unprocessable(err);
    }
  }

  /**
   * @param {Object} req - received request
   * @param {Object} res - response object
   * @param {Object} next - next middleware
   * @return {Object} - response
   */
  static async validateUnique(req, res, next) {
    const foundEmail = await User.where({ email: req.body.email }).getOne();
    const foundUsername = await User.where({ username: req.body.username }).getOne();

    if (foundEmail) {
      const err = {
        details: [
          { message: 'email already exists' },
        ],
      };
      throw Exception.conflict(err);
    }
    if (foundUsername) {
      const err = {
        details: [
          { message: 'username already exists' },
        ],
      };
      throw Exception.conflict(err);
    }
    next();
  }
}

export default AuthValidator;
