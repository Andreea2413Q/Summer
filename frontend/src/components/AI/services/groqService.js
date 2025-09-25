class GroqService {
  constructor() {
    this.apiKey = null;
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.1-8b-instant';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async testConnection() {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  async sendMessage(messages, userLocation = null) {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    const systemPrompt = `You are EcoForest AI, an expert assistant specializing in forest conservation, deforestation issues, and important forest locations worldwide. Your mission is to educate users about:

1. Forest conservation importance
2. Deforestation causes and effects
3. Reforestation solutions
4. Important forest locations and protected areas
5. Local forest information based on user location
6. Wildlife and biodiversity in forests
7. Climate change impact on forests

${userLocation ? `The user is located in: ${userLocation}. Provide relevant local forest information when possible.` : ''}

Always be informative, encouraging about conservation efforts, and provide actionable advice. Use emojis appropriately and keep responses engaging but educational.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}

export const groqService = new GroqService();