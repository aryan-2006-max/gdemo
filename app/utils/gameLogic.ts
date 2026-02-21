
import { Card, Suit, Rank, Player, GameState } from '../types/game';

export function createDeck(): Card[] {
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      let value = 0;
      switch (rank) {
        case 'A': value = 14; break;
        case 'K': value = 13; break;
        case 'Q': value = 12; break;
        case 'J': value = 11; break;
        default: value = parseInt(rank);
      }
      deck.push({ suit, rank, value });
    });
  });

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[]): Player[] {
  const players: Player[] = [
    { id: 1, name: 'Player 1', cards: [], team: 1 },
    { id: 2, name: 'Player 2', cards: [], team: 2 },
    { id: 3, name: 'Player 3', cards: [], team: 1 },
    { id: 4, name: 'Player 4', cards: [], team: 2 }
  ];

  for (let i = 0; i < 52; i++) {
    players[i % 4].cards.push(deck[i]);
  }

  players.forEach(player => {
    player.cards.sort((a, b) => {
      if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
      return b.value - a.value;
    });
  });

  return players;
}

export function getRandomTrumpSuit(): Suit {
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  return suits[Math.floor(Math.random() * suits.length)];
}

export function canPlayCard(card: Card, playerCards: Card[], leadSuit: Suit | null, trumpSuit: Suit): boolean {
  if (!leadSuit) return true;

  const hasSameSuit = playerCards.some(c => c.suit === leadSuit);
  if (hasSameSuit) {
    return card.suit === leadSuit;
  }

  return true;
}

export function determineTrickWinner(trick: Card[], leadSuit: Suit, trumpSuit: Suit): number {
  let winningCardIndex = 0;
  let winningCard = trick[0];

  for (let i = 1; i < trick.length; i++) {
    const currentCard = trick[i];

    if (currentCard.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      winningCard = currentCard;
      winningCardIndex = i;
    } else if (currentCard.suit === trumpSuit && winningCard.suit === trumpSuit) {
      if (currentCard.value > winningCard.value) {
        winningCard = currentCard;
        winningCardIndex = i;
      }
    } else if (winningCard.suit !== trumpSuit && currentCard.suit === leadSuit) {
      if (currentCard.value > winningCard.value) {
        winningCard = currentCard;
        winningCardIndex = i;
      }
    }
  }

  return winningCardIndex;
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'spades': return '♠';
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
  }
}

export function getSuitColor(suit: Suit): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';
}
