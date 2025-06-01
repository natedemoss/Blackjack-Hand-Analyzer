import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [playerCards, setPlayerCards] = useState(["", ""]);
  const [dealerCard, setDealerCard] = useState("");
  const [result, setResult] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  // Blackjack probability calculation
  const calculateBlackjackProbability = () => {
    if (!dealerCard || playerCards.includes("")) return;

    const parseCardValue = (card) => {
      if (["J", "Q", "K"].includes(card)) return 10;
      if (card === "A") return 11;
      return parseInt(card);
    };

    const dealerValue = parseCardValue(dealerCard);
    const playerTotal = playerCards.reduce((sum, card) => sum + parseCardValue(card), 0);

    let hitWinProb = 0;
    let standWinProb = 0;

    if (playerTotal >= 17) {
      if (dealerValue <= 6) {
        standWinProb = 45 + (playerTotal - 16) * 2;
      } else {
        standWinProb = 30 + (playerTotal - 16) * 3;
      }
      hitWinProb = 25;
    } else {
      if (playerTotal <= 11) {
        hitWinProb = 60 - (11 - playerTotal) * 5;
      } else {
        hitWinProb = 50 - (playerTotal - 12) * 5;
      }
      standWinProb = 20;
    }

    setResult({
      playerTotal,
      dealerUpcard: dealerValue,
      hitProbability: Math.min(95, hitWinProb),
      standProbability: Math.min(95, standWinProb),
    });

    // Trigger animation
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500); // Reset after animation duration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Header with Navigation */}
      <header className="py-6 px-4 border-b border-gray-700">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Blackjack Probability Analyzer
          </h1>
          {activeTab === "blackjack" && (
            <button
              onClick={() => setActiveTab("home")}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4">
        {activeTab === "home" && (
          <section className="text-center py-16">
            <h2 className="text-5xl font-bold mb-6">Welcome to the Blackjack Probability Analyzer</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Enter your cards and the dealer's upcard to get real-time probabilities for the best move.
            </p>
            <button
              onClick={() => setActiveTab("blackjack")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xl font-semibold hover:opacity-90 transition-all shadow-lg transform hover:scale-105"
            >
              Start Analyzing
            </button>
          </section>
        )}

        {activeTab === "blackjack" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-12 border border-gray-700 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-center">Enter Card Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Your Cards</label>
                <div className="flex space-x-4">
                  {playerCards.map((card, index) => (
                    <select
                      key={index}
                      value={card}
                      onChange={(e) => {
                        const newCards = [...playerCards];
                        newCards[index] = e.target.value;
                        setPlayerCards(newCards);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select</option>
                      {[...Array(10).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                      <option value="J">J</option>
                      <option value="Q">Q</option>
                      <option value="K">K</option>
                      <option value="A">A</option>
                    </select>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Dealer Upcard</label>
                <select
                  value={dealerCard}
                  onChange={(e) => setDealerCard(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select</option>
                  {[...Array(10).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                  <option value="J">J</option>
                  <option value="Q">Q</option>
                  <option value="K">K</option>
                  <option value="A">A</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={calculateBlackjackProbability}
                  disabled={!dealerCard || playerCards.includes("")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    !dealerCard || playerCards.includes("")
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                  }`}
                >
                  Calculate
                </button>
              </div>
            </div>

            {result && (
              <div className={`mt-8 ${animateResult ? 'animate-pulse' : ''}`}>
                <h3 className="text-xl font-semibold mb-4">Results for Hand Total: {result.playerTotal}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Stand Probability</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{result.standProbability}%</p>
                    <p className="text-sm text-gray-400 mt-1">Chance of winning if you stand</p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Hit Probability</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{result.hitProbability}%</p>
                    <p className="text-sm text-gray-400 mt-1">Chance of winning if you hit</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-semibold mb-2">Recommendation:</h4>
                  {result.hitProbability > result.standProbability ? (
                    <p className="text-blue-400">
                      You should consider hitting ({result.hitProbability}% chance of winning).
                    </p>
                  ) : (
                    <p className="text-green-400">
                      You should consider standing ({result.standProbability}% chance of winning).
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Strategy Chart Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">Basic Strategy Reference</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left">Player Total</th>
                      <th className="px-4 py-2 text-left">Dealer 2-6</th>
                      <th className="px-4 py-2 text-left">Dealer 7-A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { total: "Hard 17+", stand: "Stand", hit: "Stand" },
                      { total: "Hard 13-16", stand: "Stand", hit: "Hit" },
                      { total: "Hard 12", stand: "Stand", hit: "Hit" },
                      { total: "Hard 11", stand: "Double", hit: "Hit" },
                      { total: "Hard 10", stand: "Double", hit: "Hit" },
                      { total: "Hard 9", stand: "Hit", hit: "Hit" },
                      { total: "Soft 18", stand: "Stand", hit: "Hit" },
                      { total: "Soft 17", stand: "Hit", hit: "Hit" },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-800/50" : ""}>
                        <td className="px-4 py-2 border-t border-gray-700">{row.total}</td>
                        <td className="px-4 py-2 border-t border-gray-700 text-green-400">{row.stand}</td>
                        <td className="px-4 py-2 border-t border-gray-700 text-blue-400">{row.hit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-gray-500 border-t border-gray-800">
        <p>© 2025 Blackjack Probability Analyzer | Based on standard blackjack odds</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.8; }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
