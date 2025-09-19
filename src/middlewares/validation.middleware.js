const dataMethods = ["body", "query", "params", "headers", "file"];

export const validation = (schema) => {
  return (req, res, next) => {
    const errors = [];
    // step: loop for each dataMethod
    dataMethods.forEach((dataMethod) => {
      const result = schema[dataMethod]?.validate(req[dataMethod], {
        abortEarly: false,
      }); // {value} || {value,error}
      // step: save errors in array
      if (result?.error) {
        errors.push(result.error);
      }
    });
    // step: if errors throw error
    if (errors.length > 0) {
      throw new Error(errors);
    }
    // step: else go next
    return next();
  };
};

const arrayDataMethods = ["files"];
export const arrayValidation = (schema) => {
  return (req, res, next) => {
    const errors = [];
    // step: loop for each arrayDataMethod
    arrayDataMethods.forEach((arrayDataMethod) => {
      // ste: loop for array of arrayDataMehtod
      arrayDataMethod.forEach((item) => {
        const result = schema[arrayDataMethod]?.validate(item, {
          abortEarly: false,
        });
      });
      // step: save errors in array
      if (result?.error) {
        errors.push(result.error);
      }
    });
    // step: if errors throw error
    if (errors.length > 0) {
      throw new Error(errors);
    }
    // step: else go next
    return next();
  };
};
