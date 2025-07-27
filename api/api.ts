import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

axios.defaults.headers.common.Authorization = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});
