# Shop On The Fly 🛒

A modern ecommerce application built with React, Express.js, and PostgreSQL.

## Features

- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles
- 💳 Secure checkout process
- 📱 Responsive design
- 🔒 JWT authentication
- 🗄️ PostgreSQL database
- 🚀 RESTful API

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer
- **Validation**: Express-validator

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ShopOnTheFly
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your PostgreSQL database in `.env`

5. Set up the database:
```bash
npm run setup-db
```

6. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ShopOnTheFly/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── server/                 # Express.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── database/
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 