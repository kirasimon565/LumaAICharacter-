export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  profileImage?: string; // Filename
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Visibility {
  PRIVATE = 'private',
  LINK = 'link',
  PUBLIC = 'public'
}

export interface Character {
  id: string;
  owner: string;
  name: string;
  Image?: string; // Filename - Capitalized to match PB Schema
  greeting: string;
  visibility: Visibility;
  backstory?: string;
  personality?: string;
  style?: string;
  instructions?: string;
  shareId: string;
  created: string;
  updated: string;
}

export interface Persona {
  id: string;
  user: string; // Relation ID
  name: string;
  image?: string;
  description?: string;
  style?: string;
  isDefault: boolean;
}

export interface Chat {
  id: string;
  user: string;
  character: string;
  expand?: {
    character?: Character;
    activePersona?: Persona;
  };
  activePersona?: string;
  created: string;
  updated: string;
}

export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  chat: string;
  sender: Sender;
  text: string;
  created: string;
  updated: string;
}

// App State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ModelConfig {
  temperature: number;
  top_p: number;
  repetition_penalty: number;
}