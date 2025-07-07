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
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error management
- **Vercel Optimized**: Serverless deployment ready

## 🛠️ Tech Stack

### Frontend
- **HTML5** with semantic markup
- **CSS3** with custom properties and animations
- **Vanilla JavaScript** with modern ES6+ features
- **Tailwind CSS** for responsive design
- **Font Awesome** for icons

### Backend
- **Node.js** with Express.js framework
- **Serverless Functions** for Vercel deployment
- **CORS** for cross-origin requests
- **Helmet** for security
- **Rate Limiting** for API protection

## 📦 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compareit1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically deploy

3. **Environment Variables** (Optional)
   Set in Vercel dashboard:
   ```
   NODE_ENV=production
   ```

## 🔧 Project Structure

```
compareit/
├── api/                   # Vercel serverless functions
│   └── index.js          # Main API handler
├── public/               # Frontend files
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styles
│   └── app.js          # Frontend JavaScript
├── vercel.json          # Vercel configuration
├── package.json
└── README.md
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

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Automatic Detection**: Vercel automatically detects the Node.js project
2. **Serverless Functions**: API routes run as serverless functions
3. **Static Files**: Frontend files are served from CDN
4. **Zero Configuration**: Works out of the box

### Manual Deployment

For other platforms:

```bash
# Install dependencies
npm install

# Start production server (for platforms that support Node.js)
npm start
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
- **Serverless Architecture**: Fast, scalable deployment
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
- **Vercel**: For excellent serverless deployment platform
- **Community**: Contributors and users who help improve the platform

## 📞 Support

For support, create an issue on GitHub or contact the development team.

---

**Made with ❤️ for food lovers everywhere!**
