
'use client';

import { Card } from '../types/game';
import { getSuitSymbol, getSuitColor } from '../utils/gameLogic';

interface CardComponentProps {
  card: Card;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function CardComponent({ 
  card, 
  isPlayable = false, 
  isSelected = false, 
  onClick, 
  size = 'medium' 
}: CardComponentProps) {
  const sizeClasses = {
    small: 'w-8 h-12 text-xs',
    medium: 'w-12 h-16 text-sm',
    large: 'w-16 h-24 text-base'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} !rounded-button bg-white border-2 border-gray-300
        flex flex-col items-center justify-between p-1 shadow-sm
        ${isPlayable ? 'cursor-pointer hover:border-blue-500 hover:shadow-md' : ''}
        ${isSelected ? 'border-blue-500 shadow-md' : ''}
        ${!isPlayable && !isSelected ? 'opacity-70' : ''}
      `}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className={`font-bold ${getSuitColor(card.suit)}`}>
        {card.rank}
      </div>
      <div className={`text-lg ${getSuitColor(card.suit)}`}>
        {getSuitSymbol(card.suit)}
      </div>
      <div className={`font-bold ${getSuitColor(card.suit)} rotate-180`}>
        {card.rank}
      </div>
    </div>
  );
}
