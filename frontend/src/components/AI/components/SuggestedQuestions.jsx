const SuggestedQuestions = ({ onQuestionSelect, show, userLocation }) => {
  const getQuestions = () => {
    const baseQuestions = [
      "Why are forests important for our planet? 🌍",
      "What are the main causes of deforestation? 🪓",
      "How can I help protect forests? 🌱",
      "Tell me about reforestation efforts 🌳"
    ];

    const locationQuestions = userLocation ? [
      `What forests are near ${userLocation.city}? 🗺️`,
      `Forest conservation in ${userLocation.country} 🛡️`
    ] : [];

    return [...baseQuestions, ...locationQuestions];
  };

  if (!show) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-3">🌲 Suggested Questions:</p>
      <div className="space-y-2">
        {getQuestions().map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(question)}
            className="w-full text-left p-2 text-sm bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
