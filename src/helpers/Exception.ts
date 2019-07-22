import { HttpException, HttpStatus } from '@nestjs/common';

const {
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  NO_CONTENT,
} = HttpStatus;

const responses = {
  unprocessable: (err) => new HttpException({
    message: err.details[0].message,
  }, UNPROCESSABLE_ENTITY),

  wrongParamType: () => new HttpException({
    message: 'Incorrectly formed request',
  }, BAD_REQUEST),

  unauthorised: () => new HttpException({
    message: 'You lack privileges to access resource',
  }, UNAUTHORIZED),

  wrongCredentials: () => new HttpException({
    message: 'Provide correct login credentials',
  }, UNAUTHORIZED),

  unauthenticated: () => new HttpException({
    message: 'Invalid or expired token',
  }, UNAUTHORIZED),

  invalidToken: () => new HttpException({
    message: 'Invalid token',
  }, UNAUTHORIZED),

  missingToken: () => new HttpException({
    message: 'missing token',
  }, BAD_REQUEST),

  notFound: () => new HttpException({
    message: 'The requested resource could not be found',
  }, NOT_FOUND),

  conflict: (err) => new HttpException({
    message: err.details[0].message,
  }, CONFLICT),

  noContent: () => new HttpException({
    message: 'The reource has been deleted',
  }, NO_CONTENT),
};

export default responses;
