import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/products/123">Product</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/orders">Orders</Link> |{" "}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}
