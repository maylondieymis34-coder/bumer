
import { User, Connection, Message, ConnectionStatus } from '../types';

const STORAGE_KEY = 'bumer_db';

interface DB {
  users: Record<string, User>;
  connections: Record<string, Connection>;
  messages: Message[];
  currentUser: User | null;
}

const INITIAL_DB: DB = {
  users: {
    'bot1': { id: 'bot1', name: 'Alana', bio: 'Amo viajar e café.', age: 24, profilePhoto: 'https://picsum.photos/seed/alana/400/600', birthDate: '2000-01-01', email: 'alana@bumer.com' },
    'bot2': { id: 'bot2', name: 'Bruno', bio: 'Surf e trilhas.', age: 27, profilePhoto: 'https://picsum.photos/seed/bruno/400/600', birthDate: '1997-05-15', email: 'bruno@bumer.com' },
    'bot3': { id: 'bot3', name: 'Carla', bio: 'Design e música.', age: 22, profilePhoto: 'https://picsum.photos/seed/carla/400/600', birthDate: '2002-10-20', email: 'carla@bumer.com' },
    'bot4': { id: 'bot4', name: 'Diego', bio: 'Gamer e dev.', age: 25, profilePhoto: 'https://picsum.photos/seed/diego/400/600', birthDate: '1999-03-12', email: 'diego@bumer.com' },
  },
  connections: {},
  messages: [],
  currentUser: null,
};

class MockDB {
  private getDB(): DB {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DB;
  }

  private saveDB(db: DB) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  getCurrentUser() {
    return this.getDB().currentUser;
  }

  login(email: string) {
    const db = this.getDB();
    const user = Object.values(db.users).find(u => u.email === email);
    if (user) {
      db.currentUser = user;
      this.saveDB(db);
    }
    return user;
  }

  register(user: User) {
    const db = this.getDB();
    db.users[user.id] = user;
    db.currentUser = user;
    this.saveDB(db);
  }

  logout() {
    const db = this.getDB();
    db.currentUser = null;
    this.saveDB(db);
  }

  updateProfilePhoto(userId: string, photo: string) {
    const db = this.getDB();
    if (db.users[userId]) {
      db.users[userId].profilePhoto = photo;
      if (db.currentUser?.id === userId) {
        db.currentUser.profilePhoto = photo;
      }
      this.saveDB(db);
    }
  }

  getRadarUsers() {
    const db = this.getDB();
    const currentId = db.currentUser?.id;
    return Object.values(db.users).filter(u => u.id !== currentId);
  }

  createConnection(otherUserId: string) {
    const db = this.getDB();
    const currentId = db.currentUser?.id;
    if (!currentId) return;

    const connectionId = [currentId, otherUserId].sort().join('_');
    if (!db.connections[connectionId]) {
      db.connections[connectionId] = {
        id: connectionId,
        user1Id: currentId,
        user2Id: otherUserId,
        status: 'active',
        lastMessage: 'Nova conexão!',
        lastMessageAt: Date.now()
      };
      this.saveDB(db);
    }
    return db.connections[connectionId];
  }

  getConnections() {
    const db = this.getDB();
    const currentId = db.currentUser?.id;
    if (!currentId) return [];

    // Filter connections where current user is involved and status is not deleted
    return Object.values(db.connections).filter(c => 
      (c.user1Id === currentId || c.user2Id === currentId) && c.status !== 'deleted'
    );
  }

  sendToVault(connectionId: string) {
    const db = this.getDB();
    if (db.connections[connectionId]) {
      const now = Date.now();
      db.connections[connectionId].status = 'in_vault';
      db.connections[connectionId].vaultAddedAt = now;
      db.connections[connectionId].vaultExpiresAt = now + (5 * 24 * 60 * 60 * 1000); // 5 days
      this.saveDB(db);
    }
  }

  rescueFromVault(connectionId: string) {
    const db = this.getDB();
    if (db.connections[connectionId]) {
      db.connections[connectionId].status = 'active';
      db.connections[connectionId].vaultAddedAt = undefined;
      db.connections[connectionId].vaultExpiresAt = undefined;
      this.saveDB(db);
    }
  }

  checkExpirations() {
    const db = this.getDB();
    const now = Date.now();
    let changed = false;

    Object.keys(db.connections).forEach(id => {
      const conn = db.connections[id];
      if (conn.status === 'in_vault' && conn.vaultExpiresAt && conn.vaultExpiresAt < now) {
        conn.status = 'deleted';
        conn.deletedAt = now;
        // Delete messages
        db.messages = db.messages.filter(m => m.connectionId !== id);
        changed = true;
      }
    });

    if (changed) this.saveDB(db);
  }

  getMessages(connectionId: string) {
    return this.getDB().messages.filter(m => m.connectionId === connectionId);
  }

  sendMessage(connectionId: string, text: string) {
    const db = this.getDB();
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      connectionId,
      senderId: db.currentUser!.id,
      text,
      timestamp: Date.now()
    };
    db.messages.push(message);
    db.connections[connectionId].lastMessage = text;
    db.connections[connectionId].lastMessageAt = message.timestamp;
    this.saveDB(db);
    return message;
  }

  getUser(id: string) {
    return this.getDB().users[id];
  }
}

export const dbService = new MockDB();
