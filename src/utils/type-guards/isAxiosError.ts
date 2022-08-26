import { AxiosError } from 'axios';

export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as any)?.isAxiosError === true;
};
