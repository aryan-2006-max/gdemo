
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
  team: 1 | 2;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  trumpSuit: Suit;
  currentTrick: Card[];
  trickWinner: number | null;
  scores: { team1: number; team2: number };
  gamePhase: 'dealing' | 'playing' | 'finished';
  leadSuit: Suit | null;
  tricksWon: { team1: number; team2: number };
}
