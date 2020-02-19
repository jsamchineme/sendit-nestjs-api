import ParcelModel from 'src/resources/parcel/parcel.model';
import Exception from 'src/helpers/Exception';

const Parcel = new ParcelModel();

/**
 * @class
 */
class Roles {
  /**
   * @static
   * @param {Object} req - request received
   * @param {Object} res - response retunred
   * @param {Object} next - next middleware
   * @return {Object} - response with error messages
   */
  static isAdmin(req, res, next) {
    const user = req.decoded;

    if (user.isAdmin) {
      next();
    } else {
      throw Exception.unauthorised();
    }
  }

  /**
   * @static
   * @param {Object} req - request received
   * @param {Object} res - response retunred
   * @param {Object} next - next middleware
   * @return {Object} - response with error messages
   */
  static async isParcelOwner(req, res, next) {
    const user = req.decoded;
    const { parcelId } = req.params;
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      throw Exception.notFound();
    }

    const foundParcel = await Parcel.where({ placedBy: user.id, id: parcelId }).getOne();

    if (foundParcel) {
      next();
    } else {
      throw Exception.unauthorised();
    }
  }

  /**
   * @static
   * @param {Object} req - request received
   * @param {Object} res - response retunred
   * @param {Object} next - next middleware
   * @return {Object} - response with error messages
   */
  static async isRightUser(req, res, next) {
    const user = req.decoded;
    const { userId } = req.params;
    const isRightUser = user.id === Number(userId);

    // this parcel is found for the user
    // OR authenticated user is an admin
    if (isRightUser || user.isAdmin) {
      next();
    } else {
      throw Exception.unauthorised();
    }
  }
}

export default Roles;
