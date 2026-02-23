import { calculateDiscount } from '../data/offers';

export default function OfferCard({ offer, subtotal, isApplied, onApply, onRemove }) {
  const discount = calculateDiscount(offer, subtotal);
  const isEligible = subtotal >= offer.minOrder;

  return (
    <div
      className={`offer-card ${isApplied ? 'offer-applied' : ''} ${
        !isEligible ? 'offer-disabled' : ''
      }`}
      style={{ borderLeftColor: offer.color }}
    >
      <div className="offer-icon">{offer.icon}</div>
      <div className="offer-details">
        <h4 className="offer-title">{offer.title}</h4>
        <p className="offer-desc">{offer.description}</p>
        <p className="offer-code">
          Code: <strong>{offer.code}</strong>
        </p>
        {isEligible && (
          <p className="offer-savings">You save: ₹{discount.toFixed(2)}</p>
        )}
        {!isEligible && (
          <p className="offer-min">Min order: ₹{offer.minOrder}</p>
        )}
      </div>
      <div className="offer-action">
        {isApplied ? (
          <button className="btn btn-danger btn-sm" onClick={onRemove}>
            Remove
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onApply(offer)}
            disabled={!isEligible}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
