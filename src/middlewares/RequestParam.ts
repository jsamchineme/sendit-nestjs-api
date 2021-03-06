import Exception from 'src/helpers/Exception';

/** Validate the request Params
 * For example wherever we have /:someResourceId
 * @export
 * @class
 */
class RequestParam {
  /**
   * @static
   * @param {Object} req - request received
   * @param {Object} res - response to be returned
   * @param {Object} next - next middleware
   * @return {Object} - response with error messages
   */
  static validateParams(req, res, next) {
    // eslint-disable-next-line no-restricted-syntax
    for (const param in req.params) {
      /* istanbul ignore else  */
      if (param) {
        const paramHasId = param.search(/id/i) !== -1;
        const paramValue = req.params[param];
        // eslint-disable-next-line no-restricted-globals
        if (paramHasId && isNaN(paramValue)) {
          throw Exception.wrongParamType();
        }
      }
    }
    next();
  }
}
export default RequestParam;
