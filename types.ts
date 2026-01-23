
export enum Role {
  USER = 'user',
  AVATAR = 'avatar'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface AvatarConfig {
  modelName: string;
  engine: string;
  creator: string;
}
