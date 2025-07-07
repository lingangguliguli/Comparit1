# Compareit - Food Delivery Price Comparison Platform

A comprehensive full-stack web application that compares food delivery prices across major Indian platforms: Swiggy, Zomato, EatClub, and Dunzo.

## 🚀 Features

### Frontend
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Price Comparison**: Live pricing data from all major platforms
- **Smart Search**: Find restaurants and dishes with intelligent filtering
- **Theme Toggle**: Light and dark mode support
- **Deep Linking**: Direct integration with platform apps
- **Offers & Deals**: Current promotions and discount codes
- **Savings Calculator**: Track your potential savings

### Backend
- **RESTful API**: Clean, well-documented API endpoints
- **Real-time Data**: Live price fetching from multiple platforms
- **Caching**: Intelligent caching for optimal performance
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error management
- **Logging**: Detailed logging for monitoring and debugging

## 🛠️ Tech Stack

### Frontend
- **HTML5** with semantic markup
- **CSS3** with custom properties and animations
- **Vanilla JavaScript** with modern ES6+ features
- **Tailwind CSS** for responsive design
- **Font Awesome** for icons

### Backend
- **Node.js** with Express.js framework
- **Axios** for HTTP requests
- **Cheerio** for web scraping
- **Winston** for logging
- **Node-Cache** for in-memory caching
- **Joi** for validation
- **Helmet** for security

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compareit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Vercel Deployment

This project is optimized for Vercel deployment:

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the Node.js project

2. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   NODE_ENV=production
   LOG_LEVEL=info
   ```

3. **Build Configuration**
   The project includes `vercel.json` for proper routing:
   - API routes are handled by the Express server
   - Static files are served from the `public` directory
   - All routes fallback to the main application

### Manual Deployment

For other platforms:

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info

# API Keys (when available)
SWIGGY_API_KEY=your_swiggy_api_key
ZOMATO_API_KEY=your_zomato_api_key
EATCLUB_API_KEY=your_eatclub_api_key
DUNZO_API_KEY=your_dunzo_api_key
```

## 📚 API Documentation

### Search Endpoints

#### Search Restaurants
```http
GET /api/search?dish=pizza&isVeg=false&sortBy=price
```

**Parameters:**
- `dish` (required): Search term for food item
- `isVeg` (optional): Filter for vegetarian items
- `sortBy` (optional): Sort by 'price', 'delivery', or 'rating'
- `location` (optional): City name (default: mumbai)

**Response:**
```json
[
  {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "cuisine": ["Italian", "Pizza"],
    "rating": 4.5,
    "deliveryTime": { "min": 25, "max": 35 },
    "image": "image-url",
    "items": [...]
  }
]
```

#### Get Price Comparison
```http
GET /api/search/compare?restaurantId=mcd-001&itemId=bigmac
```

**Response:**
```json
{
  "restaurant": {...},
  "item": {...},
  "platforms": [
    {
      "platform": "swiggy",
      "available": true,
      "pricing": {
        "subtotal": 299,
        "deliveryFee": 30,
        "platformFee": 5,
        "taxes": 36,
        "discount": 50,
        "total": 320
      },
      "estimatedDeliveryTime": { "min": 18, "max": 25 },
      "rating": 4.5,
      "offers": ["SWIGGY50", "WELCOME100"]
    }
  ]
}
```

### Offers Endpoints

#### Get All Offers
```http
GET /api/offers
```

#### Get Platform Offers
```http
GET /api/offers/swiggy
```

### Health Check
```http
GET /api/health
```

## 🏗️ Project Structure

```
compareit/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── app.js            # Frontend JavaScript
├── routes/                # API routes
│   ├── search.js         # Search endpoints
│   ├── offers.js         # Offers endpoints
│   └── health.js         # Health check
├── controllers/           # Route controllers
│   ├── searchController.js
│   └── offersController.js
├── services/             # Business logic
│   ├── searchService.js
│   ├── offersService.js
│   ├── platformService.js
│   └── cacheService.js
├── middleware/           # Express middleware
│   ├── validation.js
│   └── errorMiddleware.js
├── utils/               # Utilities
│   └── logger.js
├── vercel.json         # Vercel configuration
├── server.js          # Main server file
├── package.json
└── README.md
```

## 🔍 Features in Detail

### Smart Search
- **Fuzzy Matching**: Find items even with typos
- **Category Filtering**: Filter by cuisine type
- **Dietary Preferences**: Veg/Non-veg filtering
- **Real-time Results**: Instant search as you type

### Price Comparison
- **Live Data**: Real-time pricing from all platforms
- **Detailed Breakdown**: Item price, delivery fee, taxes, discounts
- **Best Deal Highlighting**: Automatically identifies the best offer
- **Savings Calculator**: Shows potential savings

### Platform Integration
- **Deep Linking**: Direct links to platform apps
- **Cart Integration**: Pre-filled cart data
- **Offer Application**: Automatic coupon application
- **Mobile Optimization**: Seamless mobile experience

### Performance Optimization
- **Intelligent Caching**: Reduces API calls and improves speed
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Error Handling**: Graceful fallbacks for failed requests
- **Responsive Design**: Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Platform APIs**: Thanks to all food delivery platforms for their services
- **Open Source Libraries**: All the amazing libraries that made this possible
- **Community**: Contributors and users who help improve the platform

## 📞 Support

For support, email contact@compareit.com or create an issue on GitHub.

---

**Made with ❤️ for food lovers everywhere!**