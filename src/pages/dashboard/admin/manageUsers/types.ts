/* -- Types -- */
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export type FormState = {
  name: string;
  email: string;
  role: string;
};

/* -- Helpers: simple unique id for demo fallback -- */
export const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`;
