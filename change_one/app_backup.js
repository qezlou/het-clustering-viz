// Galaxy Clustering Visualization JavaScript
class ClusteringVisualizer {
    constructor() {
        this.data = null;
        this.currentPlotType = 'log';
        this.animationId = null;
        this.isAnimating = false;
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data.metadata);
            this.initializeApp();
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading-message').textContent = 
                'Error loading data. Please ensure data.json is available.';
        }
    }

    initializeApp() {
        document.getElementById('loading-message').style.display = 'none';
        
        // Set up event listeners for sliders
        const sliders = ['param1', 'param2', 'param3', 'param4'];
        sliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const valueDisplay = document.getElementById(`${param}-value`);
            
            // Add both input and touchmove events for better mobile support
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                this.updatePlot();
                this.updateStatistics();
            });
            
            // Touch-specific event for mobile devices
            slider.addEventListener('touchmove', (e) => {
                // Prevent page scrolling while adjusting sliders
                e.preventDefault();
            }, { passive: false });
        });

        // Set up plot type buttons
        this.setupPlotControls();
        
        // Add mobile-specific touch handling
        this.setupMobileInteractions();
        
        // Initial plot and statistics
        this.updatePlot();
        this.updateStatistics();
    }

    setupPlotControls() {
        const clusteringPlot = document.querySelector('.single-plot:first-child');
        const controlsHtml = `
            <div class="plot-controls">
                <button class="plot-button active" onclick="visualizer.setPlotType('log')">Log-Log</button>
                <button class="plot-button" onclick="visualizer.setPlotType('linear')">Linear</button>
                <button class="plot-button" onclick="visualizer.setPlotType('residual')">Residual</button>
            </div>
        `;
        
        const plotTitle = clusteringPlot.querySelector('.plot-title');
        plotTitle.insertAdjacentHTML('afterend', controlsHtml);
    }

    setPlotType(type) {
        this.currentPlotType = type;
        
        // Update button states
        document.querySelectorAll('.plot-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Only update the clustering plot
        if (this.data) {
            const params = this.getCurrentParameters();
            const xiData = this.data.xi_data[params.param1][params.param2][params.param3][params.param4];
            const rValues = this.data.r_values;
            this.updateClusteringPlot(rValues, xiData);
        }
    }

    getCurrentParameters() {
        return {
            param1: parseInt(document.getElementById('param1-slider').value),
            param2: parseInt(document.getElementById('param2-slider').value),
            param3: parseInt(document.getElementById('param3-slider').value),
            param4: parseInt(document.getElementById('param4-slider').value)
        };
    }

    updatePlot() {
        if (!this.data) return;

        const params = this.getCurrentParameters();
        const xiData = this.data.xi_data[params.param1][params.param2][params.param3][params.param4];
        const nmData = this.data.nm_data[params.param1][params.param2][params.param3][params.param4];
        const rValues = this.data.r_values;
        const mValues = this.data.m_values;

        // Update clustering plot
        this.updateClusteringPlot(rValues, xiData);
        
        // Update mass function plot
        this.updateMassFunctionPlot(mValues, nmData);
        
        // Add resize listener for responsive updates
        window.addEventListener('resize', this.debounce(() => {
            if (document.getElementById('clustering-plot')) {
                this.updatePlot();
            }
        }, 250));
    }

    updateClusteringPlot(rValues, xiData) {
        let trace, layout;

        switch (this.currentPlotType) {
            case 'log':
                trace = this.createLogTrace(rValues, xiData);
                layout = this.createLogLayout();
                break;
            case 'linear':
                trace = this.createLinearTrace(rValues, xiData);
                layout = this.createLinearLayout();
                break;
            case 'residual':
                trace = this.createResidualTrace(rValues, xiData);
                layout = this.createResidualLayout();
                break;
        }

        const config = this.getPlotConfig();
        Plotly.newPlot('clustering-plot', [trace], layout, config);
    }

    updateMassFunctionPlot(mValues, nmData) {
        const trace = {
            x: mValues,
            y: nmData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#48bb78',
                width: 3
            },
            marker: {
                color: '#38a169',
                size: 4
            },
            name: 'n(M)',
            hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<extra></extra>'
        };

        const layout = {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Halo Mass [M☉]',
                    font: { size: 12 }
                },
                tickfont: { size: 10 }
            },
            yaxis: {
                type: 'log',
                title: {
                    text: 'n(M) [Mpc⁻³ dex⁻¹]',
                    font: { size: 12 }
                },
                tickfont: { size: 10 }
            },
            margin: { l: 50, r: 20, t: 20, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Georgia, serif', size: 12 },
            showlegend: false,
            hovermode: 'closest'
        };

        const config = this.getPlotConfig();
        Plotly.newPlot('mass-function-plot', [trace], layout, config);
    }

    getPlotConfig() {
        return {
            responsive: true,
            displayModeBar: window.innerWidth >= 768,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            displaylogo: false,
            doubleClick: 'reset',
            scrollZoom: false,
            staticPlot: window.innerWidth < 480
        };
    }

    // Debounce function for resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    createLogTrace(rValues, xiData) {
        return {
            x: rValues,
            y: xiData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#667eea',
                width: 3
            },
            marker: {
                color: '#764ba2',
                size: 6,
                line: {
                    color: '#667eea',
                    width: 1
                }
            },
            name: 'ξ(r)',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
    }

    createLinearTrace(rValues, xiData) {
        return {
            x: rValues,
            y: xiData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#48bb78',
                width: 3
            },
            marker: {
                color: '#38a169',
                size: 6
            },
            name: 'ξ(r)',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
    }

    createResidualTrace(rValues, xiData) {
        // Calculate residuals from a power law fit (simplified)
        const powerLawFit = rValues.map(r => Math.pow(r, -1.8) * 100);
        const residuals = xiData.map((xi, i) => xi - powerLawFit[i]);
        
        return {
            x: rValues,
            y: residuals,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#ed8936',
                width: 3
            },
            marker: {
                color: '#dd6b20',
                size: 6
            },
            name: 'Residuals',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>Residual: %{y:.4f}<extra></extra>'
        };
    }

    createLogLayout() {
        const isMobile = window.innerWidth < 768;
        
        return {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            yaxis: {
                type: 'log',
                title: {
                    text: 'ξ(r)',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { 
                t: 20, 
                b: isMobile ? 50 : 60, 
                l: isMobile ? 60 : 80, 
                r: isMobile ? 15 : 20 
            },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    createLinearLayout() {
        const isMobile = window.innerWidth < 768;
        
        return {
            xaxis: {
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            yaxis: {
                title: {
                    text: 'ξ(r)',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { 
                t: 20, 
                b: isMobile ? 50 : 60, 
                l: isMobile ? 60 : 80, 
                r: isMobile ? 15 : 20 
            },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    createResidualLayout() {
        const isMobile = window.innerWidth < 768;
        
        return {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            yaxis: {
                title: {
                    text: 'Residuals from Power Law',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { 
                t: 20, 
                b: isMobile ? 50 : 60, 
                l: isMobile ? 60 : 80, 
                r: isMobile ? 15 : 20 
            },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    updateStatistics() {
        if (!this.data) return;

        const params = this.getCurrentParameters();
        const xiData = this.data.xi_data[params.param1][params.param2][params.param3][params.param4];
        const nmData = this.data.nm_data[params.param1][params.param2][params.param3][params.param4];
        const rValues = this.data.r_values;
        const mValues = this.data.m_values;
        
        // Calculate ξ(r) statistics
        const maxXi = Math.max(...xiData);
        const maxXiIndex = xiData.indexOf(maxXi);
        const peakR = rValues[maxXiIndex];
        
        // Find zero crossing (approximate)
        let zeroCrossing = 'N/A';
        for (let i = 1; i < xiData.length; i++) {
            if (xiData[i-1] > 0 && xiData[i] <= 0) {
                zeroCrossing = rValues[i].toFixed(2);
                break;
            }
        }
        
        // Calculate integral (Simpson's rule approximation)
        let integral = 0;
        for (let i = 1; i < xiData.length; i++) {
            integral += (xiData[i] + xiData[i-1]) * (rValues[i] - rValues[i-1]) / 2;
        }
        
        // Calculate n(M) statistics
        const maxNm = Math.max(...nmData);
        const maxNmIndex = nmData.indexOf(maxNm);
        const peakM = mValues[maxNmIndex];
        
        // Calculate total number density (approximate integral)
        let totalNm = 0;
        for (let i = 1; i < nmData.length; i++) {
            totalNm += (nmData[i] + nmData[i-1]) * (Math.log10(mValues[i]) - Math.log10(mValues[i-1])) / 2;
        }
        
        // Calculate high-mass objects (> 10^14 M_sun)
        let highMassNm = 0;
        for (let i = 0; i < mValues.length; i++) {
            if (mValues[i] > 1e14) {
                if (i > 0) {
                    highMassNm += (nmData[i] + nmData[i-1]) * (Math.log10(mValues[i]) - Math.log10(mValues[i-1])) / 2;
                }
            }
        }
        
        // Update statistics display
        document.getElementById('xi-max').textContent = maxXi.toFixed(4);
        document.getElementById('xi-peak-r').textContent = peakR.toFixed(2);
        document.getElementById('xi-zero').textContent = zeroCrossing;
        document.getElementById('xi-integral').textContent = integral.toFixed(3);
        
        document.getElementById('nm-max').textContent = maxNm.toExponential(2);
        document.getElementById('nm-peak-m').textContent = peakM.toExponential(1);
        document.getElementById('nm-total').textContent = totalNm.toExponential(2);
        document.getElementById('nm-highmass').textContent = highMassNm.toExponential(2);
    }

    // Animation feature for parameter exploration
    animateParameters() {
        if (this.isAnimating) {
            this.stopAnimation();
            return;
        }

        this.isAnimating = true;
        const button = document.querySelector('.animate-button');
        if (button) button.textContent = 'Stop Animation';

        let step = 0;
        const animate = () => {
            if (!this.isAnimating) return;

            // Animate through parameter values
            const param1Value = Math.floor((Math.sin(step * 0.1) + 1) * 4.5);
            const param2Value = Math.floor((Math.cos(step * 0.07) + 1) * 4.5);
            
            document.getElementById('param1-slider').value = param1Value;
            document.getElementById('param2-slider').value = param2Value;
            document.getElementById('param1-value').textContent = param1Value;
            document.getElementById('param2-value').textContent = param2Value;
            
            this.updatePlot();
            this.updateStatistics();
            
            step++;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        const button = document.querySelector('.animate-button');
        if (button) button.textContent = 'Animate Parameters';
    }

    setupMobileInteractions() {
        // Add mobile-specific interactions
        if ('ontouchstart' in window) {
            // Add visual feedback for touch interactions
            document.querySelectorAll('.plot-button').forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                });
                
                button.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Improve tooltip behavior on mobile
            document.querySelectorAll('.tooltip').forEach(tooltip => {
                tooltip.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    const tooltiptext = this.querySelector('.tooltiptext');
                    if (tooltiptext) {
                        tooltiptext.style.visibility = 'visible';
                        tooltiptext.style.opacity = '1';
                        
                        // Hide after 3 seconds
                        setTimeout(() => {
                            tooltiptext.style.visibility = 'hidden';
                            tooltiptext.style.opacity = '0';
                        }, 3000);
                    }
                });
            });
        }
    }
}

// Initialize the visualizer
const visualizer = new ClusteringVisualizer();

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    visualizer.loadData();
});
