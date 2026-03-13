/* -- Types -- */
export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  password?: string;
  phone?: string;
  createdAt?: string;
  status?: boolean;
};

export type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`;
