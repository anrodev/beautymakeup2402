import { encode as b64encode } from 'base-64';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getJwtAuthHeader = () => {

  return `Bearer ${process.env.EXPO_PUBLIC_JWT_AUTH_SECRET_KEY}`;
}

export const getWooAuthHeader = () => {
  const credentials = `${process.env.EXPO_PUBLIC_WOO_CONSUMER_KEY}:${process.env.EXPO_PUBLIC_WOO_CONSUMER_SECRET}`;
  const encoded = b64encode(credentials);
  return `Basic ${encoded}`;
}

