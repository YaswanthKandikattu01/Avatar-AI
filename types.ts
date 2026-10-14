export enum Role {
  USER = 'user',
  AVATAR = 'avatar'
}

export type AvatarModelId = 'avatar' | 'avatar-2.0';

export interface ModelInfo {
  id: AvatarModelId;
  name: string;
  version: string;
  tagline: string;
  description: string;
  badge?: string;
  capabilities: string[];
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  model?: AvatarModelId;
}

export interface AvatarConfig {
  modelName: string;
  engine: string;
  creator: string;
  version?: string;
}
