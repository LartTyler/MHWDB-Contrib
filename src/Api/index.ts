import {ApiClient as ApiClientImpl} from './ApiClient';

export const ApiClient = new ApiClientImpl(process.env.API_URL);