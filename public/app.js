// Global variables
let currentResults = [];
let isLoading = false;

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const vegFilter = document.getElementById('vegFilter');
const sortBy = document.getElementById('sortBy');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const comparisonModal = document.getElementById('comparisonModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const loading = document.getElementById('loading');
const themeToggle = document.getElementById('themeToggle');

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Search functionality
async function searchRestaurants() {
    if (isLoading) return;
    
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return;
    }
    
    showLoading(true);
    
    try {
        const params = new URLSearchParams({
            dish: query,
            isVeg: vegFilter.checked,
            sortBy: sortBy.value
        });
        
        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        displayResults(results);
        
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to search restaurants. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayResults(results) {
    currentResults = results;
    resultsGrid.innerHTML = '';
    
    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>No restaurants found</h3>
                <p>Try searching with different keywords or adjust your filters.</p>
            </div>
        `;
        resultsCount.textContent = '0 results found';
    } else {
        results.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            resultsGrid.appendChild(card);
        });
        resultsCount.textContent = `${results.length} restaurant${results.length !== 1 ? 's' : ''} found`;
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    const cuisineText = Array.isArray(restaurant.cuisine) 
        ? restaurant.cuisine.join(', ') 
        : restaurant.cuisine;
    
    card.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image" loading="lazy">
        <div class="restaurant-info">
            <div class="restaurant-header">
                <div>
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <p class="restaurant-cuisine">${cuisineText}</p>
                </div>
                <div class="restaurant-rating">
                    <i class="fas fa-star"></i>
                    ${restaurant.rating}
                </div>
            </div>
            <div class="restaurant-details">
                <span class="delivery-time">
                    <i class="fas fa-clock"></i>
                    ${restaurant.deliveryTime.min}-${restaurant.deliveryTime.max} mins
                </span>
            </div>
            <div class="restaurant-items">
                ${restaurant.items.map(item => `
                    <div class="item">
                        <div>
                            <span class="item-name">${item.name}</span>
                            ${item.isVeg ? '<i class="fas fa-leaf" style="color: var(--success-color); margin-left: 0.5rem;"></i>' : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span class="item-price">₹${item.price}</span>
                            <button class="compare-btn" onclick="compareItem('${restaurant.id}', '${item.id}')">
                                Compare
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Comparison functionality
async function compareItem(restaurantId, itemId) {
    showLoading(true);
    
    try {
        const response = await fetch(`/api/search/compare?restaurantId=${restaurantId}&itemId=${itemId}`);
        if (!response.ok) throw new Error('Comparison failed');
        
        const data = await response.json();
        displayComparison(data);
        
    } catch (error) {
        console.error('Comparison error:', error);
        showError('Failed to compare prices. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayComparison(data) {
    const { restaurant, item, platforms } = data;
    
    // Find the best deal
    const bestPlatform = platforms.reduce((best, current) => 
        current.pricing.total < best.pricing.total ? current : best
    );
    
    modalBody.innerHTML = `
        <div class="comparison-item">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>from ${restaurant.name}</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    ${Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}
                </p>
            </div>
        </div>
        
        <div class="platforms-grid">
            ${platforms.map(platform => `
                <div class="platform-card ${platform.platform === bestPlatform.platform ? 'best-deal' : ''}">
                    <div class="platform-header">
                        <h3 class="platform-name ${platform.platform}-color">${platform.platform}</h3>
                        ${platform.platform === bestPlatform.platform ? '<span class="best-deal-badge">Best Deal</span>' : ''}
                    </div>
                    
                    <div class="platform-info">
                        <span class="delivery-info">
                            <i class="fas fa-clock"></i>
                            ${platform.estimatedDeliveryTime.min}-${platform.estimatedDeliveryTime.max} mins
                        </span>
                        <span class="platform-rating">
                            <i class="fas fa-star"></i>
                            ${platform.rating}
                        </span>
                    </div>
                    
                    <div class="pricing-details">
                        <div class="pricing-row">
                            <span>Item Total:</span>
                            <span>₹${platform.pricing.subtotal}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Delivery Fee:</span>
                            <span>₹${platform.pricing.deliveryFee}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Platform Fee:</span>
                            <span>₹${platform.pricing.platformFee}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Taxes:</span>
                            <span>₹${platform.pricing.taxes}</span>
                        </div>
                        <div class="pricing-row" style="color: var(--success-color);">
                            <span>Discount:</span>
                            <span>-₹${platform.pricing.discount}</span>
                        </div>
                        <div class="pricing-row total">
                            <span>Total:</span>
                            <span>₹${platform.pricing.total}</span>
                        </div>
                    </div>
                    
                    ${platform.offers && platform.offers.length > 0 ? `
                        <div class="offers">
                            <h4>Available Offers:</h4>
                            ${platform.offers.map(offer => `<span class="offer-code">${offer}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="order-btn ${platform.platform}" onclick="orderFromPlatform('${platform.platform}', '${restaurant.id}', '${item.id}')">
                        Order from ${platform.platform}
                    </button>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius); text-align: center;">
            <h4 style="color: var(--success-color); margin-bottom: 0.5rem;">
                💰 You save ₹${Math.max(...platforms.map(p => p.pricing.total)) - bestPlatform.pricing.total} with ${bestPlatform.platform}!
            </h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                Compared to the most expensive option
            </p>
        </div>
    `;
    
    comparisonModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function orderFromPlatform(platform, restaurantId, itemId) {
    // In a real app, this would redirect to the platform's app or website
    const platformUrls = {
        swiggy: `https://www.swiggy.com/restaurants/${restaurantId}`,
        zomato: `https://www.zomato.com/restaurant/${restaurantId}`,
        eatclub: `https://www.eatclub.tv/restaurant/${restaurantId}`,
        dunzo: `https://www.dunzo.com/restaurant/${restaurantId}`
    };
    
    const url = platformUrls[platform];
    if (url) {
        window.open(url, '_blank');
    } else {
        showError(`Unable to redirect to ${platform}. Please visit their app directly.`);
    }
}

// Utility functions
function showLoading(show) {
    isLoading = show;
    loading.style.display = show ? 'flex' : 'none';
    document.body.style.overflow = show ? 'hidden' : 'auto';
}

function showError(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function closeModal() {
    comparisonModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Search functionality
    searchBtn.addEventListener('click', searchRestaurants);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchRestaurants();
        }
    });
    
    // Filter changes
    vegFilter.addEventListener('change', () => {
        if (currentResults.length > 0) {
            searchRestaurants();
        }
    });
    
    sortBy.addEventListener('change', () => {
        if (currentResults.length > 0) {
            searchRestaurants();
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Modal controls
    modalClose.addEventListener('click', closeModal);
    comparisonModal.addEventListener('click', (e) => {
        if (e.target === comparisonModal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});

// Auto-search on page load with popular items
window.addEventListener('load', () => {
    const popularSearches = ['pizza', 'burger', 'biryani', 'chinese'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    
    setTimeout(() => {
        searchInput.value = randomSearch;
        searchRestaurants();
    }, 1000);
});