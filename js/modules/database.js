import cards from '../data/cards.json' assert { type: 'json' };

export const Database = {
  cards: cards.cartas,
  getAll(mode='all') {
    if(mode === 'all') return this.cards;
    return this.cards;
  }
};
