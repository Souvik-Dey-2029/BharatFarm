# BharatFarm - Smart Agriculture Platform

A comprehensive web application designed to help farmers make smarter decisions through technology. BharatFarm provides weather monitoring, crop planning, disease detection, cost calculation, and activity scheduling tools tailored for Indian farming contexts.

## Features

- **🌤️ Weather Monitoring**: Real-time weather data with farming safety alerts
- **🍃 Leaf Disease Scanner**: Upload or capture leaf images to detect diseases and get treatment recommendations
- **🌾 Crop Planning**: Detailed information for multiple crops including rice, wheat, potato, mustard, vegetables, and maize
- **💰 Cost Calculator**: Calculate seed and fertilizer costs with support for multiple land units (Acre, Bigha, Katha)
- **📊 Revenue Prediction**: Estimate expected yields and revenue based on crop and land size
- **🗺️ Activity Roadmap**: Day-by-day farming activity schedules for each crop
- **🔔 Smart Notifications**: Personalized alerts for watering, fertilizing, and weather conditions
- **👤 User Profile**: Manage personal information, preferences, and farming history
- **📚 User Guide**: Comprehensive guide for using all features of the platform
- **💳 Subscription Plans**: Premium features and enhanced functionality options
- **📊 Session Dashboard**: Track farming activities and performance metrics
- **ℹ️ About Section**: Learn more about the platform and its mission
- **🌓 Dark/Light Theme**: Toggle between themes for comfortable viewing

## Project Structure

```
BharatFarm/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── assets/                 # Assets folder
├── css/                    # Stylesheets
│   ├── variables.css       # CSS custom properties & themes
│   ├── base.css            # Reset & base styles
│   ├── components.css      # Reusable components
│   ├── loading.css         # Loading page styles
│   ├── auth.css            # Login/register styles
│   ├── header.css          # Header & navigation
│   ├── dashboard.css       # Dashboard section
│   ├── scanner.css         # Leaf scanner section
│   ├── weather.css         # Weather section
│   ├── crops.css           # Crops section
│   ├── calculator.css      # Calculator & revenue
│   ├── roadmap.css         # Roadmap timeline
│   ├── notifications.css   # Notifications & alerts
│   ├── profile.css         # User profile
│   ├── about.css           # About section
│   ├── user-guide.css      # User guide
│   ├── session-dashboard.css # Session tracking dashboard
│   ├── subscription.css    # Subscription plans
│   └── responsive.css      # Media queries & responsive design
└── js/                     # JavaScript modules
    ├── config.js           # Configuration & constants
    ├── data.js             # Crop & disease data
    ├── auth.js             # Authentication
    ├── theme.js            # Theme management
    ├── navigation.js       # Section navigation
    ├── scanner.js          # Leaf scanner
    ├── weather.js          # Weather functionality
    ├── crops.js            # Crop selection
    ├── calculator.js       # Cost calculations
    ├── roadmap.js          # Roadmap generation
    ├── notifications.js    # Notification system
    ├── dashboard.js        # Dashboard updates
    ├── profile.js          # User profile management
    ├── user-guide.js       # User guide functionality
    ├── subscription.js     # Subscription management
    └── app.js              # Main initialization
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required for basic usage

### Installation

1. Clone or download this repository:

   ```bash
   git clone https://github.com/your-username/bharatchfarm.git
   cd BharatFarm
   ```

2. Open `index.html` in your web browser, or
3. Use a local server for better experience:

   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js with http-server
   npx http-server
   ```

4. Navigate to `http://localhost:8000` (or the port shown in your terminal)

### Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Explore Dashboard**: View quick stats and get started with various features
3. **Select a Crop**: Choose from available crops to get personalized recommendations
4. **Check Weather**: Enter your location to get farming-relevant weather data
5. **Scan Leaves**: Upload or capture leaf images to detect diseases
6. **Calculate Costs**: Enter your land size and crop to estimate costs and revenue
7. **View Roadmap**: See day-by-day farming activities for your selected crop
8. **Manage Profile**: Update personal information and farming preferences
9. **Explore Subscription**: View premium features and upgrade your experience
10. **Review Session Dashboard**: Track your farming activities and performance metrics
11. **Read User Guide**: Get detailed instructions on using all platform features

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)
- **Storage**: Browser LocalStorage for user data and preferences
- **Image Processing**: Client-side image handling for leaf scanning

## Features in Detail

### Land Unit Support

The calculator supports three common Indian land measurement units:

- **Acre**: International standard
- **Bigha**: Common in North India
- **Katha**: Common in Bihar, West Bengal, and Assam

Automatic conversion between units is provided.

### Crop Database

Includes detailed information for:

- Rice (120-150 days)
- Wheat (100-120 days)
- Potato (90-120 days)
- Mustard (110-140 days)
- Vegetables (60-90 days)
- Maize (90-120 days)

Each crop includes seed rates, fertilizer requirements, watering schedules, and market prices.

### Disease Detection

The leaf scanner can identify:

- Healthy plants
- Leaf Blight
- Powdery Mildew
- Bacterial Spot
- Nutrient Deficiency
- Rust Disease

Each diagnosis includes fertilizer recommendations and treatment tips.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Contributing

This is a demonstration project. Feel free to fork and modify for your needs.

## License

This project is provided as-is for educational and demonstration purposes.

## Contact

For questions or support, please refer to the contact information in the application footer.

---

**© 2026 BharatFarm - Smart Agriculture Platform**  
_Empowering Indian Farmers with Smart Technology_
