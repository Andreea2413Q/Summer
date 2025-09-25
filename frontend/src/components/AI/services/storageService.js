class StorageService {
  constructor() {
    this.prefix = 'ecoforest_';
  }

  setApiKey(apiKey) {
    localStorage.setItem(`${this.prefix}apiKey`, apiKey);
  }

  getApiKey() {
    return localStorage.getItem(`${this.prefix}apiKey`) || '';
  }

  setUserLocation(location) {
    localStorage.setItem(`${this.prefix}location`, JSON.stringify(location));
  }

  getUserLocation() {
    const stored = localStorage.getItem(`${this.prefix}location`);
    return stored ? JSON.parse(stored) : null;
  }

  saveChatHistory(messages) {
    localStorage.setItem(`${this.prefix}chatHistory`, JSON.stringify(messages));
  }

  getChatHistory() {
    const stored = localStorage.getItem(`${this.prefix}chatHistory`);
    return stored ? JSON.parse(stored) : [];
  }

  clearChatHistory() {
    localStorage.removeItem(`${this.prefix}chatHistory`);
  }
}

export const storageService = new StorageService();