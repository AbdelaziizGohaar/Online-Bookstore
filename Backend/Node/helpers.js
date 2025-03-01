const asyncWrapper = (promise) => promise
  .then((data) => [null, data])
  .catch((err) => [err, null]);

export {asyncWrapper};
