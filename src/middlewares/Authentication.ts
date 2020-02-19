import * as jwt from 'jsonwebtoken';
import Exception from 'src/helpers/Exception';

/**
 * Secure routes with JWT
 * @export
 * @class
 */
class Authentication {
  /**
   * @static
   * @param {Object} req - request received
   * @param {Object} res - response to be returned
   * @param {Object} next - next middleware
   * @return {Object} - response with error messages
   */
  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token || req.body.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          throw Exception.unauthenticated();
        }
        req.decoded = decoded;
        next();
      });
    } else {
      throw Exception.missingToken();
    }
  }
}

export default Authentication;
