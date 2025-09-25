import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ inputValue, setInputValue, onSend, disabled }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full p-4 border-t border-gray-200 bg-white">
      <div className="w-full flex space-x-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about forests, deforestation, or conservation..."
          className="w-full flex-1 min-w-0 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          rows="2"
          disabled={disabled}
        />
        <button
          onClick={onSend}
          disabled={disabled || !inputValue.trim()}
          className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;