const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Maison Accessory Store API',
      version: '1.0.0',
      description: 'REST API for an e-commerce accessories store',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Scan route files for annotations
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 *   - name: Users
 *     description: User account management
 *   - name: Products
 *     description: Product browsing and management
 *   - name: Cart
 *     description: Cart actions and checkout
 *   - name: Orders
 *     description: Order history and details
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products or filter by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter products
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product object
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a cart for the user
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Cart created
 *       200:
 *         description: Cart already exists
 */

/**
 * @swagger
 * /cart/{cartId}:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of items in cart
 */

/**
 * @swagger
 * /cart/{cartId}:
 *   post:
 *     summary: Add or update a product in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added/updated in cart
 */

/**
 * @swagger
 * /cart/{cartId}/checkout:
 *   post:
 *     summary: Checkout the cart and create an order
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_address
 *             properties:
 *               shipping_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Cart is empty
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 */

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
