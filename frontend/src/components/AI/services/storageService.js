class StorageService {
  constructor() {
    this.prefix = 'ecoforest_';
  }

  setApiKey(apiKey) {
    // API key în localStorage (persistent)
    localStorage.setItem(`${this.prefix}apiKey`, apiKey);
  }

  getApiKey() {
    return localStorage.getItem(`${this.prefix}apiKey`) || '';
  }

  setUserLocation(location) {
    // Location în localStorage (persistent)
    localStorage.setItem(`${this.prefix}location`, JSON.stringify(location));
  }

  getUserLocation() {
    const stored = localStorage.getItem(`${this.prefix}location`);
    return stored ? JSON.parse(stored) : null;
  }

  saveChatHistory(messages) {
    // Chat history în sessionStorage (se șterge la refresh)
    sessionStorage.setItem(`${this.prefix}chatHistory`, JSON.stringify(messages));
  }

  getChatHistory() {
    const stored = sessionStorage.getItem(`${this.prefix}chatHistory`);
    return stored ? JSON.parse(stored) : [];
  }

  clearChatHistory() {
    sessionStorage.removeItem(`${this.prefix}chatHistory`);
  }

 

  // Metodă nouă pentru a șterge tot
  clearAllData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const storageService = new StorageService();