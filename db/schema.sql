CREATE TABLE Users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ProductCategory (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Products (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id UUID REFERENCES ProductCategory(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    status VARCHAR(50) CHECK (status IN ('pending', 'shipped', 'cancelled')),
    total_price DECIMAL(10, 2),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderItems (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(id),
    product_id UUID REFERENCES Products(id),
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Cart (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CartItems (
    id UUID PRIMARY KEY,
    cart_id UUID REFERENCES Cart(id),
    product_id UUID REFERENCES Products(id),
    quantity INT NOT NULL
);

CREATE TABLE Reviews (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    product_id UUID REFERENCES Products(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);