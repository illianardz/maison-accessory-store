export default function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{product.name}</h3>
      <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} width="150" />
      <p>{product.description}</p>
      <p><strong>${product.price.toFixed(2)}</strong></p>
    </div>
  );
}
