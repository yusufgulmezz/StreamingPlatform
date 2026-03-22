// Backend model tipleri

export interface Content {
  id: number;
  title: string;
  requiredAge: number;
  duration: number;
  contentType: string;
  // Movie
  director?: string;
  genre?: string;
  // Series
  seasons?: number;
  episodes?: number;
  // Documentary
  topic?: string;
  // Podcast
  host?: string;
  episodeCount?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  subscriptionType: 'BASIC' | 'STANDARD' | 'PREMIUM';
}

export interface SubscriptionInfo {
  userId: number;
  username: string;
  plan: string;
  maxResolution: string;
  price: number;
}

export interface WatchlistItem {
  order: number;
  id: number;
  title: string;
  type: string;
  duration: string;
}

export interface ApiResult {
  result: string;
}

export interface ApiMessage {
  message: string;
}
