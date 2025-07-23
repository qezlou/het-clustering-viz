# 🌌 Cosmic Clustering Visualization - Two Exploration Methods

An interactive web application for visualizing galaxy clustering statistics with two different approaches to parameter exploration.

## 🚀 Live Demo

- **Main Hub**: https://qezlou.github.io/gal_goku/
- **Change All Parameters**: https://qezlou.github.io/gal_goku/change_all/
- **Change One Parameter**: https://qezlou.github.io/gal_goku/change_one/

## 📊 Two Exploration Methods

### 🔄 Change All Parameters (`/change_all/`)
- **Multi-dimensional exploration** of the full 4D parameter space
- **Simultaneous adjustment** of all cosmological parameters
- **Data structure**: (10, 10, 10, 10, 40) - full parameter grid
- **Best for**: Understanding parameter interactions and degeneracies

### 📈 Change One Parameter (`/change_one/`)
- **Individual parameter effects** with controlled comparison
- **One-at-a-time variation** while keeping others fixed
- **Data structure**: (5, 10, 40) - parameter sets × values × scales
- **Best for**: Understanding individual parameter impacts

## 🎯 Key Features

### Common Features
- **Mobile-first responsive design**
- **Interactive Plotly.js visualizations**
- **Real-time parameter adjustment**
- **Mathematical notation with MathJax**
- **Touch-friendly controls**

### Change All Specific
- **4 simultaneous sliders** for Ωₘ, σ₈, h, nₛ
- **Multi-dimensional parameter space exploration**
- **Statistical analysis panel**
- **Multiple plot types** (log-log, linear, residual)

### Change One Specific
- **Parameter selection dropdown**
- **Fiducial model comparison**
- **Parameter range visualization**
- **Focused individual parameter analysis**

## 📁 Project Structure

```
het-clustering-viz/
├── index.html                 # Main navigation hub
├── change_all/                # Multi-parameter version
│   ├── index.html
│   ├── app.js
│   ├── config.js
│   ├── styles.css
│   ├── data.json
│   ├── gen_data.py
│   └── convert_data.py
├── change_one/                # Single-parameter version
│   ├── index.html
│   ├── app_one.js
│   ├── config_one.js
│   ├── styles_one.css
│   ├── data_one.json
│   ├── gen_data_one.py
│   └── convert_data_one.py
└── README.md
```

## 🛠️ Setup & Deployment

### Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/qezlou/gal_goku.git
   cd gal_goku
   ```

2. **Generate data for both versions**:
   ```bash
   # Change all version
   cd change_all
   python3 gen_data.py
   python3 convert_data.py
   cd ..
   
   # Change one version
   cd change_one
   python3 gen_data_one.py
   python3 convert_data_one.py
   cd ..
   ```

3. **Serve locally**:
   ```bash
   python3 -m http.server 8000
   ```

4. **Access**: http://localhost:8000

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add cosmic clustering visualization with dual approaches"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **URLs will be**:
   - Main: `https://yourusername.github.io/repository-name/`
   - Change All: `https://yourusername.github.io/repository-name/change_all/`
   - Change One: `https://yourusername.github.io/repository-name/change_one/`

## 📊 Data Formats

### Change All Version
```json
{
  "parameters": {
    "param1": [0, 1, 2, ..., 9],
    "param2": [0, 1, 2, ..., 9],
    "param3": [0, 1, 2, ..., 9],
    "param4": [0, 1, 2, ..., 9]
  },
  "xi_data": [10][10][10][10][40],
  "r_values": [40 scales]
}
```

### Change One Version
```json
{
  "parameters": {
    "0": {"name": "Fiducial", "description": "..."},
    "1": {"name": "Ω_m", "description": "..."},
    "2": {"name": "σ_8", "description": "..."},
    "3": {"name": "h", "description": "..."},
    "4": {"name": "n_s", "description": "..."}
  },
  "xi_data": [5][10][40],
  "r_values": [40 scales]
}
```

## 🎨 Customization

### Colors & Styling
- Modify CSS variables in the respective `styles*.css` files
- Update color schemes in `config*.js` files

### Parameters
- Adjust parameter ranges and descriptions in config files
- Modify data generation scripts for different physics

### Plot Types
- Add new visualization modes in the JavaScript files
- Customize Plotly.js configurations

## 📱 Mobile Optimization

Both versions are fully optimized for mobile devices:
- **Touch-friendly sliders** with larger touch targets
- **Responsive layouts** that adapt to screen size
- **Optimized plot dimensions** for mobile viewing
- **Disabled conflicting interactions** (scroll-zoom, etc.)

## 🔬 Scientific Background

The two-point correlation function ξ(r) quantifies galaxy clustering:
- **Physical meaning**: Excess probability of finding galaxy pairs at separation r
- **Cosmological dependence**: Sensitive to matter density, fluctuation amplitude, expansion rate
- **Scale dependence**: Different physical processes dominate at different scales

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cosmological simulation methodology
- Interactive visualization best practices
- Mobile-first responsive design principles

---

⭐ **Star this repository if you find it useful!** ⭐
