import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '../constants';
import { User, Character, Chat, Message, Persona } from '../types';

export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto cancellation to allow multiple requests
pb.autoCancellation(false);

export const getFileUrl = (recordId: string, collectionId: string, filename: string) => {
  if (!filename) return 'https://picsum.photos/400/400';
  return `${POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}`;
};

export const api = {
  // Characters
  getCharacters: async () => {
    return await pb.collection('characters').getFullList<Character>({ sort: '-updated' });
  },
  getPublicCharacters: async () => {
    return await pb.collection('characters').getList<Character>(1, 50, { 
      filter: 'visibility = "public"',
      sort: '-updated' 
    });
  },
  createCharacter: async (formData: FormData) => {
    return await pb.collection('characters').create<Character>(formData);
  },
  
  // Chats
  getChats: async () => {
    return await pb.collection('chats').getFullList<Chat>({ 
      sort: '-updated', 
      expand: 'character,activePersona' 
    });
  },
  createChat: async (characterId: string, personaId?: string) => {
    const userId = pb.authStore.model?.id;
    // Check if exists
    try {
      const existing = await pb.collection('chats').getFirstListItem<Chat>(`user="${userId}" && character="${characterId}"`);
      return existing;
    } catch (e) {
      // Create new
      return await pb.collection('chats').create<Chat>({
        user: userId,
        character: characterId,
        activePersona: personaId
      });
    }
  },

  // Messages
  getMessages: async (chatId: string) => {
    return await pb.collection('messages').getList<Message>(1, 100, {
      filter: `chat="${chatId}"`,
      sort: 'created'
    });
  },
  sendMessage: async (chatId: string, text: string, sender: 'user' | 'ai') => {
    return await pb.collection('messages').create<Message>({
      chat: chatId,
      text,
      sender
    });
  },

  // Personas
  getUserPersonas: async () => {
    const userId = pb.authStore.model?.id;
    return await pb.collection('personas').getFullList<Persona>({ filter: `user="${userId}"` });
  }
};