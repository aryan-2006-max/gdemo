'use client';

import { useState, useEffect } from 'react';
import { GameState, Card, Player } from '../types/game';
import { 
  createDeck, 
  dealCards, 
  getRandomTrumpSuit, 
  canPlayCard, 
  determineTrickWinner 
} from '../utils/gameLogic';
import GameBoard from './GameBoard';

export default function GameController() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayer: 1,
    trumpSuit: 'spades',
    currentTrick: [],
    trickWinner: null,
    scores: { team1: 0, team2: 0 },
    gamePhase: 'dealing',
    leadSuit: null,
    tricksWon: { team1: 0, team2: 0 }
  });

  const [playedCards, setPlayedCards] = useState<Card[]>([]);
  const [trickCount, setTrickCount] = useState(0);
  const [gameWinner, setGameWinner] = useState<number | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = createDeck();
    const players = dealCards(deck);
    const trumpSuit = getRandomTrumpSuit();

    setTimeout(() => {
      setGameState({
        players,
        currentPlayer: 1,
        trumpSuit,
        currentTrick: [],
        trickWinner: null,
        scores: { team1: 0, team2: 0 },
        gamePhase: 'playing',
        leadSuit: null,
        tricksWon: { team1: 0, team2: 0 }
      });
    }, 2000);
  };

  const playCard = (card: Card) => {
    if (gameState.gamePhase !== 'playing') return;

    const currentPlayerData = gameState.players[gameState.currentPlayer - 1];
    
    if (!canPlayCard(card, currentPlayerData.cards, gameState.leadSuit, gameState.trumpSuit)) {
      return;
    }

    const newPlayedCards = [...playedCards, card];
    const newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayer - 1].cards = newPlayers[gameState.currentPlayer - 1].cards.filter(
      c => !(c.suit === card.suit && c.rank === card.rank)
    );

    let newLeadSuit = gameState.leadSuit;
    if (playedCards.length === 0) {
      newLeadSuit = card.suit;
    }

    setPlayedCards(newPlayedCards);
    setGameState({
      ...gameState,
      players: newPlayers,
      leadSuit: newLeadSuit,
      currentPlayer: gameState.currentPlayer === 4 ? 1 : gameState.currentPlayer + 1
    });

    if (newPlayedCards.length === 4) {
      const winnerIndex = determineTrickWinner(newPlayedCards, newLeadSuit!, gameState.trumpSuit);
      const winnerPlayerId = winnerIndex + 1;
      const winnerTeam = gameState.players[winnerIndex].team;
      
      const newTricksWon = { ...gameState.tricksWon };
      if (winnerTeam === 1) {
        newTricksWon.team1++;
      } else {
        newTricksWon.team2++;
      }

      const newTrickCount = trickCount + 1;
      setTrickCount(newTrickCount);

      // Check if any team has won 7 tricks
      let winner = null;
      if (newTricksWon.team1 >= 7) {
        winner = 1;
      } else if (newTricksWon.team2 >= 7) {
        winner = 2;
      }

      setTimeout(() => {
        setPlayedCards([]);
        setGameState({
          ...gameState,
          players: newPlayers,
          currentPlayer: winnerPlayerId,
          leadSuit: null,
          tricksWon: newTricksWon,
          gamePhase: winner ? 'finished' : 'playing'
        });
        
        if (winner) {
          setGameWinner(winner);
        }
      }, 2000);
    }
  };

  const startNewGame = () => {
    setPlayedCards([]);
    setTrickCount(0);
    setGameWinner(null);
    setGameState({
      players: [],
      currentPlayer: 1,
      trumpSuit: 'spades',
      currentTrick: [],
      trickWinner: null,
      scores: { team1: 0, team2: 0 },
      gamePhase: 'dealing',
      leadSuit: null,
      tricksWon: { team1: 0, team2: 0 }
    });
    initializeGame();
  };

  return (
    <div>
      <GameBoard 
        gameState={gameState} 
        playedCards={playedCards}
        onCardPlay={playCard}
        gameWinner={gameWinner}
      />
      
      {gameState.gamePhase === 'finished' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={startNewGame}
            className="bg-blue-500 text-white px-6 py-3 !rounded-button font-bold shadow-lg hover:bg-blue-600"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}