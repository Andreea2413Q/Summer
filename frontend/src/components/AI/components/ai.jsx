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

  // Debug logging enhanced pentru locație
  useEffect(() => {
    console.log('🔍 Debug - showApiInput state:', showApiInput);
    console.log('🔍 Debug - isConnected:', isConnected);
    console.log('🔍 Debug - apiKey length:', apiKey.length);
    if (userLocation) {
      console.log('🔍 Debug - userLocation DETAILED:', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        accuracy: userLocation.accuracy,
        timestamp: userLocation.timestamp,
        fullObject: userLocation
      });
    } else {
      console.log('🔍 Debug - userLocation: NULL');
    }
  }, [showApiInput, isConnected, apiKey, userLocation]);

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
      setTimeout(() => setShowApiInput(true), 2000);
    }

    if (savedHistory.length > 0) {
      console.log('💬 Loading chat history:', savedHistory.length, 'messages');
      const historyWithDates = savedHistory.map((msg, index) => ({
        ...msg,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(historyWithDates);
    } else {
      console.log('🆕 Starting fresh chat');
      setMessages([{
        id: `welcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ✅ Unique ID
        type: 'bot',
        content: '🌲 **Welcome to EcoForest AI!**\n\nI\'m your intelligent assistant for forest conservation and environmental awareness!\n\n**What I can help you with:**\n🌍 Forest importance and biodiversity\n🛡️ Deforestation causes and solutions\n📍 Forest locations and protected areas\n🌱 Conservation efforts and how to help\n🗺️ Location-based forest information\n\n**To unlock full AI capabilities:** Click the ⚙️ Settings button to add your Groq API key!\n\nWhat would you like to learn about forests today?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Enhanced handle location updates cu informații geografice
  useEffect(() => {
    if (userLocation && !hasShownLocationSuggestion) {
      console.log('📍 ForestChatbot - Location received with full details:', userLocation);
      
      // Determinăm informații generale despre regiune bazate pe coordonate
      const getRegionInfo = (lat, lng) => {
        // Europa
        if (lat >= 35 && lat <= 71 && lng >= -10 && lng <= 40) {
          if (lat >= 43 && lat <= 49 && lng >= 20 && lng <= 30) {
            return "Eastern Europe (Romania/Balkans region)";
          }
          return "Europe";
        }
        // America de Nord
        if (lat >= 25 && lat <= 72 && lng >= -168 && lng <= -52) {
          return "North America";
        }
        // Asia
        if (lat >= -10 && lat <= 80 && lng >= 60 && lng <= 180) {
          return "Asia";
        }
        return "Unknown region";
      };

      const regionInfo = getRegionInfo(userLocation.latitude, userLocation.longitude);
      
      const locationMessage = `📍 **Location Successfully Connected to AI!**\n\n**Your Coordinates:**\n• Latitude: ${userLocation.latitude.toFixed(6)}\n• Longitude: ${userLocation.longitude.toFixed(6)}\n• Accuracy: ±${Math.round(userLocation.accuracy)} meters\n• Detected: ${userLocation.timestamp}\n• Estimated Region: ${regionInfo}\n\n🤖 **AI is now location-aware and ready!**\n\nI can now help you discover:\n🌲 Forest areas and national parks in your region\n🏞️ Tourist attractions and nature spots nearby\n🛡️ Protected areas and wildlife reserves\n🥾 Hiking trails and eco-tourism opportunities\n📊 Environmental data specific to your area\n\n💡 **Try asking:** "What forests are near my location?" or "Show me tourist attractions in my area!" 🗺️✨`;
      
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
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ✅ Unique ID with prefix
      type,
      content,
      timestamp: new Date()
    };
    console.log('💬 Adding message:', type, content.substring(0, 50) + '...');
    setMessages(prev => [...prev, newMessage]);
  };

  // ENHANCED handleSend cu context geografic îmbunătățit
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    console.log('📤 ForestChatbot - Sending message:', userMessage);
    console.log('🗺️ ForestChatbot - Available userLocation:', userLocation);
    
    addMessage('user', userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      if (isConnected) {
        console.log('🤖 Using AI response with enhanced location data...');
        
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        let contextualMessage = userMessage;
        
        // ENHANCED LOCATION CONTEXT cu informații geografice
        if (userLocation) {
          // Determinăm contextul geografic
          const getGeographicContext = (lat, lng) => {
            // România
            if (lat >= 43.5 && lat <= 48.3 && lng >= 20.0 && lng <= 30.0) {
              return {
                country: "Romania",
                region: "Eastern Europe",
                climate: "temperate continental",
                forests: "Carpathian Mountains, Transylvanian forests, Danube Delta",
                parks: "Piatra Craiului, Bucegi, Retezat National Parks"
              };
            }
            // Context general pentru alte regiuni
            return {
              region: "Unknown region",
              note: "Please provide region-specific information based on coordinates"
            };
          };

          const geoContext = getGeographicContext(userLocation.latitude, userLocation.longitude);
          
          const locationContext = `\n\n[LOCATION CONTEXT: The user is located at coordinates ${userLocation.latitude.toFixed(6)}°N, ${userLocation.longitude.toFixed(6)}°E (accuracy ±${Math.round(userLocation.accuracy)}m). Geographic context: ${JSON.stringify(geoContext)}. Please provide specific information about forests, national parks, tourist attractions, and environmental data relevant to this exact geographic location. When mentioning places, use real names and distances from the user's coordinates. Be geographically accurate and specific.]`;
          
          contextualMessage += locationContext;
          console.log('✅ Enhanced location context added to AI message');
          console.log('📍 Geographic context:', geoContext);
        } else {
          console.log('⚠️ No location available - AI will use general responses');
        }

        console.log('📤 Final message to AI with location context length:', contextualMessage.length);

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
    
    // Enhanced location-based responses
    if (userLocation && (lowerMessage.includes('near') || lowerMessage.includes('area') || lowerMessage.includes('around') || lowerMessage.includes('location') || lowerMessage.includes('local'))) {
      return `🗺️ **Location-Based Information Available!**\n\nI can see you're located at:\n📍 **Coordinates:** ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}\n⏰ **Detected:** ${userLocation.timestamp}\n🎯 **Accuracy:** ±${Math.round(userLocation.accuracy)}m\n\n🔑 **For detailed, AI-powered location analysis:**\n• Connect your Groq API key via ⚙️ Settings\n• Get specific forest recommendations for your exact location\n• Discover nearby parks, trails, and protected areas\n• Find tourist attractions and eco-spots in your region\n• Access real-time environmental data for your coordinates\n\n**Click the Settings button to unlock full location-aware capabilities!** 🌲📍✨`;
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
        "What's the environmental status of my region?",
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
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-green-500 to-blue-50">
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
                    <span className="text-xs">Location: {userLocation.latitude.toFixed(2)}, {userLocation.longitude.toFixed(2)}</span>
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

      {/* Enhanced API Key Input Panel */}
      {showApiInput && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg border-b">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                 
                  <p className="text-sm opacity-90">Connect your Groq API key for advanced location-aware capabilities</p>
                </div>
              </div>
              <button
                onClick={handleCloseApiInput}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Groq API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Groq API key here..."
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  />
                </div>
                
                <button
                  onClick={handleTestApiKey}
                  disabled={isTestingConnection || !apiKey.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isTestingConnection ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Testing Connection...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Connect & Test API</span>
                    </>
                  )}
                </button>

                {isConnected && (
                  <div className="flex items-center space-x-2 text-green-300 bg-green-500/20 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">✅ Connected Successfully!</span>
                  </div>
                  )}
                  <p className="text-xs text-white/80">
                    💡 <strong>Get your free API key:</strong> Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">console.groq.com</a> to create an account and generate your API key.
                  </p>
               
               
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white/90">🎯 What you'll unlock with location data:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>Specific forests and parks near your coordinates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>Tourist attractions with exact distances</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>Regional environmental data and climate info</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>Local hiking trails and eco-tourism spots</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>Conservation projects in your area</span>
                  </li>
                </ul>
                
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Messages container with proper unique keys */}
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