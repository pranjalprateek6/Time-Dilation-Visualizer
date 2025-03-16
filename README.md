# Time Dilation Visualizer

An interactive web application that visualizes Einstein's theory of relativity and time dilation effects. Experience how time changes at different velocities relative to the speed of light.

![Time Dilation Visualizer](images/icon-192.png)

## 🌟 Features

- **Interactive Speed Control**: Adjust velocity from 0 to beyond the speed of light (theoretical visualization)
- **Real-time Calculations**: See the Lorentz factor and time dilation calculations update instantly
- **Visual Effects**: Experience visual representations of:
  - Normal speed (sub-light) travel
  - Light speed approach effects
  - Theoretical superluminal travel effects
- **Synchronized Clocks**: Compare Earth time vs Traveler time with animated clock faces
- **Detailed Physics Explanations**: Learn about Einstein's theory of relativity and time dilation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **PWA Support**: Install as a Progressive Web App for offline use
- **Immersive UI**: Beautiful space-themed interface with animated galaxy background

## 🚀 Technologies Used

- **HTML5/CSS3**: Modern, responsive layout with advanced animations
- **JavaScript**: Dynamic calculations and interactive elements
- **Canvas API**: For the animated galaxy background
- **GSAP**: For smooth animations
- **MathJax**: For rendering mathematical equations
- **Font Awesome**: For icons
- **Service Worker**: For offline functionality (PWA)

## 📱 Progressive Web App

This application is built as a Progressive Web App (PWA), which means you can:
- Install it on your device
- Use it offline
- Get a native app-like experience

## 🔧 Installation & Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/time-dilation-visualizer.git
   ```

2. Navigate to the project directory:
   ```
   cd time-dilation-visualizer
   ```

3. Open the project with a local server. You can use any of these methods:

   - Using Python:
     ```
     # Python 3
     python -m http.server
     
     # Python 2
     python -m SimpleHTTPServer
     ```

   - Using Node.js (with http-server):
     ```
     # Install http-server if you haven't already
     npm install -g http-server
     
     # Run the server
     http-server
     ```

4. Open your browser and navigate to `http://localhost:8000` (or whatever port your server is using)

## 🔍 How It Works

The Time Dilation Visualizer uses the Lorentz factor from Einstein's theory of relativity to calculate how time changes at different velocities. The formula used is:

γ = 1 / √(1 - v²/c²)

Where:
- γ (gamma) is the Lorentz factor
- v is the velocity
- c is the speed of light

Time dilation is calculated as:
t' = t × γ

Where:
- t' is the dilated time (time experienced by the traveler)
- t is the proper time (time experienced by the stationary observer)
- γ is the Lorentz factor

## 📚 Learn More

Visit the "Learn the Physics" page in the application to understand more about Einstein's theory of relativity and time dilation.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- Einstein's theory of relativity
- The physics community for making complex concepts accessible
- Open-source libraries and tools used in this project 
