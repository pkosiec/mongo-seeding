export const throwOnNegativeNumber = (
  variable: number | undefined,
  name: string,
) => {
  if (typeof variable !== 'undefined' && (isNaN(variable) || variable < 0)) {
    const error = new Error(
      `Value of '${name}' parameter should be a positive number`,
    );
    error.name = 'InvalidParameterError';
    throw error;
  }
};
