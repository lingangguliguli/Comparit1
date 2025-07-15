const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

app.use('/api/', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for demonstration
const mockRestaurants = [
  {
    id: 'mcd-001',
    name: "McDonald's",
    cuisine: ['Fast Food', 'Burgers'],
    rating: 4.2,
    deliveryTime: { min: 20, max: 30 },
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300',
    items: [
      {
        id: 'bigmac',
        name: 'Big Mac',
        price: 299,
        isVeg: false,
        image: 'https://images.pexels.com/photos/552056/pexels-photo-552056.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  },
  {
    id: 'pizza-hut-001',
    name: 'Pizza Hut',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.1,
    deliveryTime: { min: 25, max: 35 },
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
    items: [
      {
        id: 'margherita',
        name: 'Margherita Pizza',
        price: 399,
        isVeg: true,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  },
  {
    id: 'kfc-001',
    name: 'KFC',
    cuisine: ['Fast Food', 'Chicken'],
    rating: 4.3,
    deliveryTime: { min: 15, max: 25 },
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300',
    items: [
      {
        id: 'zinger-burger',
        name: 'Zinger Burger',
        price: 249,
        isVeg: false,
        image: 'https://images.pexels.com/photos/552056/pexels-photo-552056.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  }
];

const mockOffers = [
  { platform: 'swiggy', code: 'SWIGGY50', discount: 50, minOrder: 299 },
  { platform: 'zomato', code: 'ZOMATO40', discount: 40, minOrder: 199 },
  { platform: 'eatclub', code: 'EATCLUB30', discount: 30, minOrder: 149 },
  { platform: 'dunzo', code: 'DUNZO25', discount: 25, minOrder: 99 }
];

// API Routes
app.get('/api/search', (req, res) => {
  const { dish, isVeg, sortBy } = req.query;
  let results = [...mockRestaurants];
  
  if (dish) {
    results = results.filter(restaurant => 
      restaurant.items.some(item => 
        item.name.toLowerCase().includes(dish.toLowerCase())
      )
    );
  }
  
  if (isVeg === 'true') {
    results = results.map(restaurant => ({
      ...restaurant,
      items: restaurant.items.filter(item => item.isVeg)
    })).filter(restaurant => restaurant.items.length > 0);
  }
  
  if (sortBy === 'price') {
    results.sort((a, b) => a.items[0]?.price - b.items[0]?.price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }
  
  res.json(results);
});

app.get('/api/search/compare', (req, res) => {
  const { restaurantId, itemId } = req.query;
  const restaurant = mockRestaurants.find(r => r.id === restaurantId);
  const item = restaurant?.items.find(i => i.id === itemId);
  
  if (!restaurant || !item) {
    return res.status(404).json({ error: 'Restaurant or item not found' });
  }
  
  const platforms = [
    {
      platform: 'swiggy',
      available: true,
      pricing: {
        subtotal: item.price,
        deliveryFee: 30,
        platformFee: 5,
        taxes: Math.round(item.price * 0.12),
        discount: 50,
        total: item.price + 30 + 5 + Math.round(item.price * 0.12) - 50
      },
      estimatedDeliveryTime: { min: 18, max: 25 },
      rating: 4.5,
      offers: ['SWIGGY50', 'WELCOME100']
    },
    {
      platform: 'zomato',
      available: true,
      pricing: {
        subtotal: item.price + 20,
        deliveryFee: 25,
        platformFee: 3,
        taxes: Math.round((item.price + 20) * 0.12),
        discount: 40,
        total: (item.price + 20) + 25 + 3 + Math.round((item.price + 20) * 0.12) - 40
      },
      estimatedDeliveryTime: { min: 22, max: 30 },
      rating: 4.3,
      offers: ['ZOMATO40']
    },
    {
      platform: 'eatclub',
      available: true,
      pricing: {
        subtotal: item.price - 30,
        deliveryFee: 35,
        platformFee: 7,
        taxes: Math.round((item.price - 30) * 0.12),
        discount: 30,
        total: (item.price - 30) + 35 + 7 + Math.round((item.price - 30) * 0.12) - 30
      },
      estimatedDeliveryTime: { min: 25, max: 35 },
      rating: 4.1,
      offers: ['EATCLUB30']
    },
    {
      platform: 'dunzo',
      available: true,
      pricing: {
        subtotal: item.price + 10,
        deliveryFee: 20,
        platformFee: 2,
        taxes: Math.round((item.price + 10) * 0.12),
        discount: 25,
        total: (item.price + 10) + 20 + 2 + Math.round((item.price + 10) * 0.12) - 25
      },
      estimatedDeliveryTime: { min: 15, max: 20 },
      rating: 4.4,
      offers: ['DUNZO25']
    }
  ];
  
  res.json({ restaurant, item, platforms });
});

app.get('/api/offers', (req, res) => {
  res.json(mockOffers);
});

app.get('/api/offers/:platform', (req, res) => {
  const { platform } = req.params;
  const offers = mockOffers.filter(offer => offer.platform === platform);
  res.json(offers);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

module.exports = app;