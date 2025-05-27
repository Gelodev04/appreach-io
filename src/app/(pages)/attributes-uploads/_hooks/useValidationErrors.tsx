import { useState } from 'react';

type ColumnValidationRule = {
  value: string;
  regex: string;
  format_description: string;
};

type ValidationErrorItem = {
  value: string;
  line: number;
};

type ColumnValidationError = {
  invalid: ValidationErrorItem[];
  format: string;
};

export function useValidationErrors() {
  const [validationErrors, setValidationErrors] = useState<Record<string, ColumnValidationError>>(
    {}
  );

  const resetValidationErrors = () => {
    setValidationErrors({});
  };

  const validateAll = (
    mappedCols: Record<string, string>,
    data: any[],
    columnValidation: ColumnValidationRule[]
  ) => {
    const errors: Record<string, ColumnValidationError> = {};

    Object.entries(mappedCols).forEach(([header, value]) => {
      const validator = columnValidation.find((v) => v.value === value);
      if (validator) {
        const regex = new RegExp(validator.regex);
        const invalid = data
          .map((row, index) => ({
            value: row[header],
            line: index + 2,
          }))
          .filter((item) => !regex.test(item.value));

        if (invalid.length > 0) {
          errors[header] = {
            invalid,
            format: validator.format_description,
          };
        }
      }
    });

    setValidationErrors(errors);
  };

  const validateSingle = (
    header: string,
    value: string,
    data: any[],
    columnValidation: ColumnValidationRule[]
  ) => {
    const validator = columnValidation.find((v) => v.value === value);
    if (!validator) return;

    const regex = new RegExp(validator.regex);
    const invalid = data
      .map((row, index) => ({
        value: row[header],
        line: index + 2,
      }))
      .filter((item) => !regex.test(item.value));

    setValidationErrors((prev) => {
      if (invalid.length > 0) {
        return {
          ...prev,
          [header]: {
            invalid,
            format: validator.format_description,
          },
        };
      }

      const { [header]: _, ...rest } = prev;
      return rest;
    });
  };

  return {
    validationErrors,
    validateAll,
    validateSingle,
    resetValidationErrors,
  };
}
