import { useApp } from '../context/AppContext';

export default function CartItem({ item }) {
  const { dispatch } = useApp();
  const gstAmount = (item.price * item.quantity * item.gstRate) / 100;
  const itemTotal = item.price * item.quantity + gstAmount;

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-img" />
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-desc">{item.description}</p>
        <p className="cart-item-price">
          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
        </p>
        <p className="cart-item-gst">
          GST ({item.gstRate}%): ₹{gstAmount.toFixed(2)}
        </p>
        <p className="cart-item-total">Total: ₹{itemTotal.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <button
          className="qty-btn"
          onClick={() =>
            dispatch({
              type: 'UPDATE_QUANTITY',
              payload: { id: item.id, quantity: item.quantity - 1 },
            })
          }
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() =>
            dispatch({
              type: 'UPDATE_QUANTITY',
              payload: { id: item.id, quantity: item.quantity + 1 },
            })
          }
        >
          +
        </button>
        <button
          className="remove-btn"
          onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
