import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to fetch product:', err));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // Ideally, you'd store cartId in context or get from backend
      const cartId = localStorage.getItem('cartId');
      if (!cartId) return alert('No cart found. Please login or create one.');

      await api.post(`/cart/${cartId}`, {
        product_id: id,
        quantity: Number(quantity)
      });
      setStatus('Added to cart!');
    } catch (err) {
      console.error('Add to cart failed', err);
      setStatus('Failed to add to cart');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} width="300" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>

      <label>
        Quantity:
        <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </label>
      <button onClick={handleAddToCart}>Add to Cart</button>

      {status && <p>{status}</p>}
    </div>
  );
}
