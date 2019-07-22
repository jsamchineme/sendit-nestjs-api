import * as joi from 'joi';
import {
  parcelCreateSchema,
  changeDestinationSchema,
  changeStatusSchema,
  changeLocationSchema,
} from '../../requestSchemas/parcel';
import Exception from '../../helpers/Exception';
import ParcelModel from '../../resources/parcel/parcel.model';

const Parcel = new ParcelModel();

/**
 * @export
 * @class ParcelValidator
 */
class ParcelValidator {
  /**
   * @param {Object} req - received request
   * @param {Object} res - response object
   * @param {Object} next - next middleware
   * @return {Object} - response
   */
  static async validateCreate(req, res, next) {
    try {
      await joi.validate(req.body, parcelCreateSchema);
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
  static async validateChangeDestination(req, res, next) {
    try {
      await joi.validate(req.body, changeDestinationSchema);
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
  static async validateStatus(req, res, next) {
    const parcel = await Parcel.where({ status: 'delivered', id: req.params.parcelId }).getOne();
    if (parcel) {
      const err = {
        details: [
          { message: 'status is already set as delivered' },
        ],
      };
      throw Exception.unprocessable(err);
    }
    next();
  }

  /**
   * @param {Object} req - received request
   * @param {Object} res - response object
   * @param {Object} next - next middleware
   * @return {Object} - response
   */
  static async validateChangeStatus(req, res, next) {
    try {
      await joi.validate(req.body, changeStatusSchema);
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
  static async validateChangeLocation(req, res, next) {
    try {
      await joi.validate(req.body, changeLocationSchema);
      next();
    } catch (err) {
      throw Exception.unprocessable(err);
    }
  }
}

export default ParcelValidator;
