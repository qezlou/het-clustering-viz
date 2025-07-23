# 🌌 Galaxy Clustering Visualization

An interactive web application for visualizing galaxy clustering statistics and the two-point correlation function ξ(r) across different cosmological parameters.

![Galaxy Clustering Visualization](https://img.shields.io/badge/Status-Active-brightgreen)
![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🚀 Features

- **Interactive Parameter Control**: Adjust cosmological parameters (Ωₘ, σ₈, h, nₛ) with smooth sliders
- **Real-time Visualization**: See instant updates to the correlation function ξ(r)
- **Multiple Plot Types**: 
  - Log-log scale visualization
  - Linear scale visualization  
  - Residual analysis
- **Statistical Analysis**: Real-time calculation of clustering statistics
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Mathematical Notation**: Proper rendering of scientific notation with MathJax

## 🎯 Live Demo

Visit the live application: [Your GitHub Pages URL]

### 📱 Mobile Optimization

The website is fully optimized for mobile devices with:
- **Touch-friendly sliders** with larger touch targets
- **Responsive layout** that stacks controls above the plot on mobile
- **Optimized plot dimensions** for smaller screens
- **Mobile-first CSS design** ensuring fast loading
- **Simplified interactions** on very small screens
- **Disabled scroll-zoom** to prevent conflicts with page scrolling

To test mobile layout locally, use your browser's developer tools and toggle device simulation.

## 📊 Data

The visualization uses synthetic galaxy clustering data generated from cosmological simulations. The data includes:

- **5D Data Array**: (10, 10, 10, 10, 40) representing parameter space and correlation function
- **Parameter Space**: 4 cosmological parameters with 10 values each
- **Correlation Function**: ξ(r) measured at 40 different separation scales
- **Scale Range**: 0.1 to 100 Mpc/h with logarithmic spacing

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/het-clustering-viz.git
   cd het-clustering-viz
   ```

2. **Generate the data** (if needed):
   ```bash
   python3 gen_data.py
   python3 convert_data.py
   ```

3. **Serve locally** (required due to CORS restrictions):
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js (if you have it)
   npx serve .
   
   # Using PHP (if you have it)
   php -S localhost:8000
   ```

4. **Open in browser**: Navigate to `http://localhost:8000`

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit with galaxy clustering visualization"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Click "Save"

3. **Access your site**: `https://yourusername.github.io/het-clustering-viz/`

## 📁 Project Structure

```
het-clustering-viz/
├── index.html          # Main HTML file
├── app.js             # JavaScript application logic
├── styles.css         # Custom CSS styles
├── data.json          # Converted data for web consumption
├── gen_data.py        # Python script to generate synthetic data
├── convert_data.py    # Python script to convert H5 to JSON
├── data.h5           # Original HDF5 data file
└── README.md         # This file
```

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The design uses CSS custom properties for easy theming
- Responsive design breakpoints can be adjusted

### Functionality
- Add new plot types in `app.js`
- Extend parameter controls or add new statistics
- Customize the correlation function analysis

### Data
- Replace `data.json` with your own clustering data
- Modify parameter names and ranges in the HTML
- Adjust the correlation function calculation in JavaScript

## 🔧 Technical Details

### Dependencies
- **Plotly.js**: Interactive plotting library
- **MathJax**: Mathematical notation rendering
- **Modern Browsers**: ES6+ JavaScript features

### Data Format
The application expects a JSON file with the following structure:
```json
{
  "parameters": {
    "param1": [0, 1, 2, ...],
    "param2": [0, 1, 2, ...],
    "param3": [0, 1, 2, ...],
    "param4": [0, 1, 2, ...]
  },
  "r_values": [0.1, 0.12, 0.15, ...],
  "xi_data": [[[[...]]]], // 5D array
  "metadata": {...}
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Future Enhancements

- [ ] Add more cosmological parameters
- [ ] Implement power spectrum visualization
- [ ] Add data export functionality
- [ ] Include error bars and uncertainty quantification
- [ ] Add animation features for parameter exploration
- [ ] Implement comparison with observational data

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Galaxy clustering data methodology inspired by cosmological N-body simulations
- Design inspiration from modern data visualization principles
- Mathematical notation support provided by MathJax

## 📧 Contact

For questions or suggestions, please open an issue or contact [your.email@example.com].

---

⭐ **Star this repository if you find it useful!** ⭐