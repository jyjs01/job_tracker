export type FieldErrors = Record<string, string[]>;
export type ApiErrorResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
  formErrors?: string[];
  details?: {
    fieldErrors?: FieldErrors;
    formErrors?: string[];
  };
};