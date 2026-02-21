
'use client';

import { GameState, Card } from '../types/game';
import { getSuitSymbol, getSuitColor } from '../utils/gameLogic';
import CardComponent from './CardComponent';

interface GameBoardProps {
  gameState: GameState;
  playedCards: Card[];
  onCardPlay: (card: Card) => void;
  gameWinner?: number | null;
}

export default function GameBoard({ gameState, playedCards, onCardPlay, gameWinner }: GameBoardProps) {
  const { players, currentPlayer, trumpSuit, tricksWon, gamePhase } = gameState;

  if (gamePhase === 'dealing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Dealing Cards...</h2>
          <p className="text-gray-600">Setting up the game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Game Status */}
        <div className="bg-white !rounded-button shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Team 1</div>
              <div className="text-xl font-bold text-blue-600">{tricksWon.team1}</div>
              <div className="text-xs text-gray-500">Need 7 to win</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Trump Suit</div>
              <div className={`text-2xl ${getSuitColor(trumpSuit)}`}>
                {getSuitSymbol(trumpSuit)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Team 2</div>
              <div className="text-xl font-bold text-red-600">{tricksWon.team2}</div>
              <div className="text-xs text-gray-500">Need 7 to win</div>
            </div>
          </div>
        </div>

        {/* Current Turn Indicator */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white !rounded-button shadow-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Player {currentPlayer}'s Turn</div>
            <div className={`inline-block px-3 py-1 !rounded-button ${
              players[currentPlayer - 1]?.team === 1 ? 'bg-blue-600' : 'bg-red-600'
            }`}>
              Team {players[currentPlayer - 1]?.team}
            </div>
            <div className="text-sm mt-2 opacity-90">
              {currentPlayer === 1 ? "You're first to play!" : "It's your turn to play a card"}
            </div>
          </div>
        </div>

        {/* Current Trick */}
        <div className="bg-white !rounded-button shadow-lg p-4 mb-4">
          <h3 className="text-lg font-bold mb-2 text-center">Current Trick</h3>
          <div className="grid grid-cols-2 gap-2 justify-items-center mb-4">
            {playedCards.map((card, index) => (
              <div key={index} className="text-center">
                <CardComponent card={card} size="medium" />
                <div className="text-xs text-gray-600 mt-1">
                  Player {index + 1}
                </div>
              </div>
            ))}
          </div>
          {playedCards.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No cards played yet
            </div>
          )}
        </div>

        {/* Current Player's Cards */}
        <div className="bg-white !rounded-button shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Your Cards</h3>
            <div className="text-sm text-gray-600">
              {players[currentPlayer - 1]?.cards.length} cards left
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {players[currentPlayer - 1]?.cards.map((card, index) => (
              <CardComponent
                key={index}
                card={card}
                isPlayable={true}
                onClick={() => onCardPlay(card)}
                size="medium"
              />
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-2 text-center">
            Tap a card to play it
          </div>
        </div>

        {/* All Players Status */}
        <div className="bg-white !rounded-button shadow-lg p-4 mb-4">
          <h3 className="text-lg font-bold mb-3 text-center">All Players</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(playerId => {
              const player = players[playerId - 1];
              const isCurrentPlayer = currentPlayer === playerId;
              return (
                <div key={playerId} className={`!rounded-button p-3 border-2 ${
                  isCurrentPlayer ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="text-center">
                    <div className="text-sm font-bold mb-1">
                      Player {playerId}
                    </div>
                    <div className={`text-xs px-2 py-1 !rounded-button ${
                      player?.team === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Team {player?.team}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {player?.cards.length} cards
                    </div>
                    {isCurrentPlayer && (
                      <div className="text-xs text-green-600 font-bold mt-1">
                        Active Turn
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 !rounded-button p-4 mb-4">
          <h4 className="text-sm font-bold text-yellow-800 mb-2">How to Play:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Each player takes turns playing one card</li>
            <li>• Follow the lead suit if you have it</li>
            <li>• If you don't have the lead suit, you can play any card</li>
            <li>• Trump cards beat all other suits</li>
            <li>• First team to win 7 tricks wins the game</li>
            <li>• Pass the device to the next player after your turn</li>
          </ul>
        </div>

        {/* Game Over */}
        {gamePhase === 'finished' && (
          <div className="bg-white !rounded-button shadow-lg p-4 text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">Game Over!</h2>
            <div className="text-xl mb-2">
              {gameWinner === 1 ? 'Team 1 Wins!' : 'Team 2 Wins!'}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Final Score: Team 1: {tricksWon.team1} - Team 2: {tricksWon.team2}
            </div>
            <div className="text-sm text-green-600 font-bold">
              First team to win 7 tricks wins the game!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
