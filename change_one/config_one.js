// Configuration for Galaxy Clustering Visualization - One Parameter
const CONFIG_ONE = {
    // Plot settings
    plot: {
        defaultType: 'log',
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            fiducial: '#718096',
            min: '#e53e3e',
            max: '#48bb78',
            success: '#48bb78',
            warning: '#ed8936',
            error: '#e53e3e'
        },
        dimensions: {
            width: '100%',
            height: '400px'
        }
    },
    
    // Parameter settings for one-by-one variation
    parameters: {
        0: {
            name: 'Fiducial',
            symbol: 'Ref',
            description: 'Reference cosmological model',
            min: 0,
            max: 0,
            default: 0,
            unit: ''
        },
        1: {
            name: 'Ω_m',
            symbol: 'Ω<sub>m</sub>',
            description: 'Matter density parameter - controls the amount of matter in the universe',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.1, 0.5],
            unit: ''
        },
        2: {
            name: 'σ_8',
            symbol: 'σ<sub>8</sub>',
            description: 'Amplitude of matter fluctuations on 8 Mpc/h scales',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.6, 1.2],
            unit: ''
        },
        3: {
            name: 'h',
            symbol: 'h',
            description: 'Hubble parameter - controls the expansion rate of the universe',
            min: 0,
            max: 9,
            default: 5,
            realRange: [0.5, 0.8],
            unit: ''
        },
        4: {
            name: 'n_s',
            symbol: 'n<sub>s</sub>',
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
        xiDescription: 'Two-point correlation function',
        dataShape: [5, 10, 40] // [parameters, values, scales]
    },
    
    // UI settings
    ui: {
        title: 'Cosmic Clustering - One Parameter',
        subtitle: 'Explore individual parameter effects on galaxy clustering',
        showTooltips: true,
        showComparison: true,
        mobile: {
            hideTooltips: false,
            simplifiedControls: true,
            largerTouchTargets: true,
            reducedMargin: true
        }
    },
    
    // GitHub settings
    github: {
        repo: 'qezlou/gal_goku',
        showCorner: false // Disabled for cleaner one-parameter interface
    }
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_ONE;
}
