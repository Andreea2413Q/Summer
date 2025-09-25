import React, { useState, useEffect, useRef } from 'react';
import { groqService } from '../services/groqService';
import { storageService } from '../services/storageService';
import ApiKeyInput from './ApiKeyInput';
import SuggestedQuestions from './SuggestedQuestions';
import Message from './Message';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { Trees, Settings, MapPin, Key, X, CheckCircle, AlertCircle } from 'lucide-react';

const ForestChatbot = ({ userLocation }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownLocationSuggestion, setHasShownLocationSuggestion] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const messagesEndRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug - showApiInput state:', showApiInput);
    console.log('🔍 Debug - isConnected:', isConnected);
    console.log('🔍 Debug - apiKey length:', apiKey.length);
  }, [showApiInput, isConnected, apiKey]);

  // Initialize chatbot
  useEffect(() => {
    console.log('🚀 Initializing ForestChatbot...');
    
    const savedApiKey = storageService.getApiKey();
    const savedHistory = storageService.getChatHistory();

    if (savedApiKey) {
      console.log('📝 Found saved API key');
      setApiKey(savedApiKey);
      groqService.setApiKey(savedApiKey);
      testConnection(savedApiKey);
    } else {
      console.log('⚠️ No saved API key found');
      // Show API input immediately if no key is saved
      setTimeout(() => setShowApiInput(true), 2000);
    }

    if (savedHistory.length > 0) {
      console.log('💬 Loading chat history:', savedHistory.length, 'messages');
      const historyWithDates = savedHistory.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(historyWithDates);
    } else {
      console.log('🆕 Starting fresh chat');
      setMessages([{
        id: 1,
        type: 'bot',
        content: '🌲 **Welcome to EcoForest AI!**\n\nI\'m your intelligent assistant for forest conservation and environmental awareness!\n\n**What I can help you with:**\n🌍 Forest importance and biodiversity\n🛡️ Deforestation causes and solutions\n📍 Forest locations and protected areas\n🌱 Conservation efforts and how to help\n🗺️ Location-based forest information\n\n**To unlock full AI capabilities:** Click the ⚙️ Settings button to add your Groq API key!\n\nWhat would you like to learn about forests today?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Handle location updates
  useEffect(() => {
    if (userLocation && !hasShownLocationSuggestion) {
      console.log('📍 Location detected:', userLocation);
      
      const locationMessage = `📍 **Location Detected Successfully!**\n\n**Your Coordinates:**\n• Latitude: ${userLocation.latitude.toFixed(6)}\n• Longitude: ${userLocation.longitude.toFixed(6)}\n• Accuracy: ±${Math.round(userLocation.accuracy)} meters\n• Detected: ${userLocation.timestamp}\n\n🌲 **I can now help you discover:**\n• Forest areas and national parks near you\n• Local tourist attractions and nature spots\n• Protected areas and wildlife reserves\n• Hiking trails and eco-tourism opportunities\n• Environmental data for your region\n\n💡 **Pro tip:** Ask me "What forests are near my location?" or "Show me tourist attractions around my area!" 🗺️✨`;
      
      setTimeout(() => {
        addMessage('bot', locationMessage);
        setHasShownLocationSuggestion(true);
      }, 3000);
    }
  }, [userLocation, hasShownLocationSuggestion]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      storageService.saveChatHistory(messages);
    }
  }, [messages]);

  const testConnection = async (key = apiKey) => {
    console.log('🔄 Testing connection with key length:', key?.length);
    setIsTestingConnection(true);
    
    try {
      groqService.setApiKey(key);
      await groqService.testConnection();
      setIsConnected(true);
      storageService.setApiKey(key);
      console.log('✅ Connection successful!');
      return true;
    } catch (error) {
      setIsConnected(false);
      console.error('❌ Connection failed:', error);
      throw error;
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    try {
      await testConnection();
      setShowApiInput(false);
      addMessage('bot', '🎉 **Excellent! Groq AI Connected Successfully!**\n\n✅ Your API key is working perfectly!\n✅ Full AI capabilities are now unlocked!\n✅ Location-aware responses enabled!\n\nI can now provide:\n🧠 Detailed AI-powered responses\n🌍 Comprehensive forest information worldwide\n📍 Location-specific recommendations\n🔍 Advanced environmental data analysis\n\n**Ready to explore forests with AI power!** 🚀🌲');
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`❌ API Connection Error: ${error.message}\n\nPlease check:\n• API key is correct\n• You have internet connection\n• Groq service is available`);
    }
  };

  const handleToggleApiInput = () => {
    console.log('⚙️ Toggling API input. Current state:', showApiInput);
    setShowApiInput(!showApiInput);
  };

  const handleCloseApiInput = () => {
    console.log('❌ Closing API input');
    setShowApiInput(false);
  };

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    console.log('💬 Adding message:', type, content.substring(0, 50) + '...');
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    console.log('📤 Sending message:', userMessage);
    
    addMessage('user', userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      if (isConnected) {
        console.log('🤖 Using AI response...');
        
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        // Add location context to the message if available
        let contextualMessage = userMessage;
        if (userLocation && (userMessage.toLowerCase().includes('near') || 
                            userMessage.toLowerCase().includes('area') || 
                            userMessage.toLowerCase().includes('around') ||
                            userMessage.toLowerCase().includes('local'))) {
          contextualMessage += `\n\n[User Location Context: Latitude ${userLocation.latitude.toFixed(6)}, Longitude ${userLocation.longitude.toFixed(6)}, detected at ${userLocation.timestamp}]`;
        }

        const response = await groqService.sendMessage(
          [...conversationHistory, { role: 'user', content: contextualMessage }]
        );
        
        addMessage('bot', response);
      } else {
        console.log('🔧 Using local response...');
        const response = getLocalResponse(userMessage);
        setTimeout(() => {
          addMessage('bot', response);
        }, 1000);
      }
    } catch (error) {
      console.error('Send message error:', error);
      addMessage('bot', `❌ **Oops! Something went wrong...**\n\nError: ${error.message}\n\n**Troubleshooting:**\n• Check your internet connection\n• Verify your API key is correct\n• Try refreshing the page\n• Check if Groq service is available\n\n**Need help?** Click the ⚙️ Settings to check your API key!`);
    } finally {
      setIsTyping(false);
    }
  };

  const getLocalResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    console.log('🔧 Generating local response for:', lowerMessage);
    
    // Location-based responses
    if (userLocation && (lowerMessage.includes('near') || lowerMessage.includes('area') || lowerMessage.includes('around'))) {
      return `🗺️ **Location-Based Information Available!**\n\nI can see you're located at:\n📍 **Coordinates:** ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}\n⏰ **Detected:** ${userLocation.timestamp}\n\n🔑 **For detailed, AI-powered location analysis:**\n• Connect your Groq API key via ⚙️ Settings\n• Get specific forest recommendations\n• Discover nearby parks and trails\n• Find tourist attractions and eco-spots\n• Access real-time environmental data\n\n**Click the Settings button to unlock full capabilities!** 🌲📍✨`;
    }
    
    if (lowerMessage.includes('important') || lowerMessage.includes('why')) {
      return "🌍 **Why Forests Are Absolutely Crucial:**\n\n🫁 **Environmental Benefits:**\n• Produce 28% of Earth's oxygen\n• Absorb 2.6 billion tons of CO2 annually\n• Regulate global water cycles\n• Prevent soil erosion and flooding\n\n🐾 **Biodiversity Hotspots:**\n• Home to 80% of terrestrial species\n• Support 1.6 billion people's livelihoods\n• Provide medicinal plants and resources\n\n💡 **Want deeper insights?** Connect your Groq API key for comprehensive AI analysis! ⚙️🔑";
    }
    
    if (lowerMessage.includes('deforestation')) {
      return "🪓 **Understanding Deforestation Crisis:**\n\n📊 **Primary Causes:**\n• 🌾 Agriculture expansion (80% of deforestation)\n• 🏗️ Urban development and infrastructure\n• 🪵 Commercial logging operations\n• ⛏️ Mining and resource extraction\n• 🔥 Forest fires (natural and human-caused)\n\n⚠️ **Impact:** We lose 10 million hectares annually!\n\n🔑 **For detailed solutions and action plans:** Connect your Groq API key via Settings! 🌱⚙️";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('protect')) {
      return "🌱 **How YOU Can Protect Our Forests:**\n\n🛒 **Consumer Choices:**\n• Choose FSC-certified products\n• Reduce paper consumption\n• Support sustainable brands\n• Buy local, organic foods\n\n🤝 **Direct Action:**\n• Plant trees in your community\n• Support conservation organizations\n• Volunteer for forest restoration\n• Educate others about forest importance\n\n🔑 **Get personalized action plans:** Connect Groq API for AI-powered suggestions! ⚙️💚";
    }

    if (lowerMessage.includes('forest') || lowerMessage.includes('tourism') || lowerMessage.includes('tourist')) {
      const locationText = userLocation ? `\n\n📍 **Your Location:** ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}` : '';
      return `🌲 **Forest Tourism & Conservation!**${locationText}\n\n🎯 **What I can share with AI enabled:**\n• Detailed forest location databases\n• Tourist attraction recommendations\n• Eco-tourism opportunities\n• Protected area information\n• Hiking trail suggestions\n• Local wildlife spotting guides\n\n🔑 **Unlock full potential:** Add your Groq API key in ⚙️ Settings for comprehensive, location-aware responses! 🚀🗺️`;
    }
    
    return "🌲 **Great Question About Our Forests!**\n\n🔧 **Current Mode:** Local responses only\n\n🚀 **Upgrade to AI Mode for:**\n• Comprehensive forest databases\n• Real-time environmental data\n• Location-specific recommendations\n• Detailed conservation strategies\n• Advanced ecological insights\n\n🔑 **Ready to unlock full potential?** Click the ⚙️ Settings button to add your Groq API key!\n\n**It's quick, free, and opens up a world of forest knowledge!** 🌍✨";
  };

  const getLocationAwareSuggestions = () => {
    const baseSuggestions = [
      "Why are forests so important for our planet?",
      "What are the main causes of deforestation?",
      "How can I help protect forests and wildlife?"
    ];

    if (userLocation) {
      return [
        "What forests and national parks are near my location?",
        "Show me the best tourist attractions around my area",
        "Are there any protected wildlife areas near me?",
        "Find hiking trails and eco-tourism spots nearby",
        ...baseSuggestions
      ];
    }

    return [
      ...baseSuggestions,
      "Tell me about famous forests around the world",
      "What are the best forest destinations for eco-tourism?"
    ];
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Trees className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EcoForest AI</h1>
              <p className="text-sm opacity-90 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-yellow-300'}`}></span>
                {isConnected ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI Connected
                  </span>
                ) : (
                  <span className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Local Mode
                  </span>
                )}
                {userLocation && (
                  <>
                    <MapPin className="h-3 w-3 ml-3 mr-1" />
                    <span className="text-xs">Location Available</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isConnected && (
              <button
                onClick={handleToggleApiInput}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg"
                title="Connect API for full features"
              >
                <Key className="h-4 w-4" />
                <span>Connect AI</span>
              </button>
            )}
            
            <button
              onClick={handleToggleApiInput}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 relative"
              title="API Settings"
            >
              <Settings className="h-5 w-5" />
              {showApiInput && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* API Key Input - Using your existing component */}
      {showApiInput && (
        <div className="relative">
          <button
            onClick={handleCloseApiInput}
            className="absolute top-2 right-2 z-10 p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Close API Settings"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
          <ApiKeyInput
            apiKey={apiKey}
            setApiKey={setApiKey}
            onTest={handleTestApiKey}
            isConnected={isConnected}
          />
          <div className="bg-green-100 px-4 pb-3 border-b border-green-200">
            <p className="text-xs text-green-700">
              💡 <strong>Benefits of connecting:</strong> Get AI-powered forest insights, location-specific recommendations, detailed conservation data, and personalized eco-tourism suggestions!
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-green-50">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Suggested Questions */}
      <SuggestedQuestions
        onQuestionSelect={setInputValue}
        show={messages.length <= 2}
        suggestions={getLocationAwareSuggestions()}
      />

      {/* Chat Input */}
      <div className="border-t border-green-200 bg-white">
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};

export default ForestChatbot;