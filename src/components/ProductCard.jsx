export default function ProductCard({ product, onAdd }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="product-desc">{product.description}</p>
        <p className="product-brand">{product.brand} • {product.category}</p>
        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          <span className="product-gst">+{product.gstRate}% GST</span>
        </div>
      </div>
      {onAdd && (
        <button className="btn btn-primary add-btn" onClick={() => onAdd(product)}>
          + Add to Cart
        </button>
      )}
    </div>
  );
}
