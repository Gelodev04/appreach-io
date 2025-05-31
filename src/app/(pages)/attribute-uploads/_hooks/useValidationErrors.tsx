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

  const clearValidationError = (header: string) => {
    setValidationErrors((prev) => {
      const { [header]: _, ...rest } = prev;
      return rest;
    });
  };

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
      if (validator && validator.regex) {
        // check regex existence
        // Unescape double backslashes into single backslashes
        const raw = validator.regex.replace(/\\\\/g, '\\');
        const regex = new RegExp(raw, 'u');

        const invalid = data
          .map((row, index) => ({
            value: row[header],
            line: index + 2,
          }))
          .filter((item) => {
            if (
              item.value === undefined ||
              item.value === null ||
              item.value.toString().trim() === ''
            ) {
              return false;
            }
            return !regex.test(item.value.toString().trim());
          });

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
    if (!validator || !validator.regex) return; // check regex existence

    const regex = new RegExp(validator.regex, 'u');
    const invalid = data
      .map((row, index) => ({
        value: row[header],
        line: index + 2,
      }))
      .filter((item) => {
        if (
          item.value === undefined ||
          item.value === null ||
          item.value.toString().trim() === ''
        ) {
          return false;
        }
        return !regex.test(item.value.toString().trim());
      });

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
    clearValidationError,
  };
}
