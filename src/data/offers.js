const offers = [
  {
    id: 1,
    code: 'FIRST50',
    title: '50% Off on First Order',
    description: 'Get 50% off up to ₹200 on your first self-checkout order',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 200,
    minOrder: 300,
    color: '#e63946',
    icon: '🎉',
  },
  {
    id: 2,
    code: 'SAVE20',
    title: 'Flat ₹20 Off',
    description: 'Get flat ₹20 off on orders above ₹150',
    discountType: 'flat',
    discountValue: 20,
    maxDiscount: 20,
    minOrder: 150,
    color: '#0077b6',
    icon: '💰',
  },
  {
    id: 3,
    code: 'UPI10',
    title: '10% Cashback on UPI',
    description: 'Pay via UPI and get 10% cashback up to ₹100',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 100,
    minOrder: 200,
    color: '#2a9d8f',
    icon: '📱',
  },
  {
    id: 4,
    code: 'WEEKEND',
    title: 'Weekend Special ₹75 Off',
    description: 'Flat ₹75 off on weekend orders above ₹500',
    discountType: 'flat',
    discountValue: 75,
    maxDiscount: 75,
    minOrder: 500,
    color: '#f77f00',
    icon: '🎊',
  },
  {
    id: 5,
    code: 'CARD15',
    title: '15% Off with Card Payment',
    description: 'Get 15% off up to ₹150 when paying by card',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 150,
    minOrder: 250,
    color: '#9b5de5',
    icon: '💳',
  },
];

export function calculateDiscount(offer, subtotal) {
  if (subtotal < offer.minOrder) return 0;
  if (offer.discountType === 'percentage') {
    const disc = (subtotal * offer.discountValue) / 100;
    return Math.min(disc, offer.maxDiscount);
  }
  return offer.discountValue;
}

export default offers;
