import React from 'react';
import { Bot, User } from 'lucide-react';

const Message = ({ message }) => {
  const isBot = message.type === 'bot';
  
  // Handle timestamp - convert to Date if it's a string
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 w-full`}>
      <div className={`flex max-w-[85%] min-w-0 ${isBot ? '' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-2' : 'ml-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
        </div>
        <div className={`rounded-lg px-4 py-2 min-w-0 break-words ${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-900 shadow-sm' 
            : 'bg-green-500 text-white shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere">
            {message.content}
          </p>
          <p className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-green-100'
          }`}>
            {timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;