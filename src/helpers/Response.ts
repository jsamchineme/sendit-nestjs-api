const responses = {
  unprocessable: (err) => ({
    message: err.details[0].message,
  }),
  wrongParamType: () => ({
    message: 'Incorrectly formed request',
  }),
  success: (data) => ({
    data,
  }),
  created: (data) => ({
    data,
  }),
  unauthorised: () => ({
    message: 'You lack privileges to access resource',
  }),
  wrongCredentials: () => ({
    message: 'Provide correct login credentials',
  }),
  unauthenticated: () => ({
    message: 'Invalid or expired token',
  }),
  invalidToken: () => ({
    message: 'Invalid token',
  }),
  missingToken: () => ({
    message: 'missing token',
  }),
  notFound: () => ({
    message: 'The requested resource could not be found',
  }),
  conflict: (err) => ({
    message: err.details[0].message,
  }),
  noContent: () => ({
    message: 'The reource has been deleted',
  }),
};

export default responses;
