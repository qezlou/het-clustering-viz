// Configuration for Galaxy Clustering Visualization
const CONFIG = {
    // Plot settings
    plot: {
        defaultType: 'log', // 'log', 'linear', or 'residual'
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#48bb78',
            warning: '#ed8936',
            error: '#e53e3e'
        },
        dimensions: {
            width: '100%',
            height: '500px'
        }
    },
    
    // Parameter settings
    parameters: {
        param1: {
            name: 'Ω<sub>m</sub>',
            description: 'Matter density parameter - controls the amount of matter in the universe',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.1, 0.5], // Real physical range for display
            unit: ''
        },
        param2: {
            name: 'σ<sub>8</sub>',
            description: 'Amplitude of matter fluctuations on 8 Mpc/h scales',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.6, 1.2],
            unit: ''
        },
        param3: {
            name: 'h',
            description: 'Hubble parameter - controls the expansion rate of the universe',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.5, 0.8],
            unit: ''
        },
        param4: {
            name: 'n<sub>s</sub>',
            description: 'Spectral index - describes the scale dependence of primordial fluctuations',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.9, 1.1],
            unit: ''
        }
    },
    
    // Data settings
    data: {
        rMin: 0.1,
        rMax: 100,
        rUnit: 'Mpc/h',
        xiDescription: 'Two-point correlation function'
    },
    
    // UI settings
    ui: {
        title: 'Galaxy Clustering Visualization',
        subtitle: 'Interactive exploration of the two-point correlation function ξ(r)',
        showTooltips: true,
        showStatistics: true,
        animationSpeed: 100, // milliseconds between frames
        mobile: {
            hideTooltips: false, // Keep tooltips on mobile
            simplifiedControls: true,
            largerTouchTargets: true,
            reducedMargin: true
        }
    },
    
    // GitHub settings
    github: {
        repo: 'qezlou/het-clustering-viz',
        showCorner: true
    }
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
