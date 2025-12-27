
export type ConnectionStatus = 'active' | 'in_vault' | 'deleted';

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  age: number;
  profilePhoto: string;
  birthDate: string;
}

export interface Connection {
  id: string;
  user1Id: string;
  user2Id: string;
  status: ConnectionStatus;
  vaultAddedAt?: number;
  vaultExpiresAt?: number;
  deletedAt?: number;
  lastMessage?: string;
  lastMessageAt?: number;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  timestamp: number;
}
