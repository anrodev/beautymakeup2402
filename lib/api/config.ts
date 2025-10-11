import Constants from "expo-constants";

import { encode as b64encode } from 'base-64';

export const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const getJwtAuthHeader = () => {

  return `Bearer ${Constants.expoConfig?.extra?.jwtAuthSecretKey}`;
}

export const getWooAuthHeader = () => {
  const credentials = `${Constants.expoConfig?.extra?.wooConsumerKey}:${Constants.expoConfig?.extra?.wooConsumerSecret}`;
  const encoded = b64encode(credentials);
  return `Basic ${encoded}`;
}

