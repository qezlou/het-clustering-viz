import h5py
import numpy as np

# Generate data for one-by-one parameter variation
# Data shape: (5, 10, 40)
# - 5 different parameters (including a fiducial/reference parameter set)
# - 10 discrete values for each parameter
# - 40 scale points for xi(r)

data = {}

# Generate xi data: (5, 10, 40)
# Parameter 0: Fiducial model (baseline comparison)
# Parameters 1-4: Individual parameter variations
np.random.seed(42)  # For reproducible results

# Base correlation function shape
r_values = np.logspace(-1, 2, 40)  # 0.1 to 100 Mpc/h
base_xi = (r_values / 5.0) ** (-1.8) * 0.1  # Power law with some normalization

# Initialize data array
xi_data = np.zeros((5, 10, 40))

# Parameter definitions and their physical ranges
param_info = {
    0: {'name': 'Fiducial', 'range': [0.3, 0.3], 'description': 'Reference cosmology'},
    1: {'name': 'Ω_m', 'range': [0.1, 0.5], 'description': 'Matter density parameter'},
    2: {'name': 'σ_8', 'range': [0.6, 1.2], 'description': 'Amplitude of matter fluctuations'},
    3: {'name': 'h', 'range': [0.5, 0.8], 'description': 'Hubble parameter'},
    4: {'name': 'n_s', 'range': [0.9, 1.1], 'description': 'Spectral index'}
}

# Generate data for each parameter
for param_idx in range(5):
    for value_idx in range(10):
        if param_idx == 0:  # Fiducial model - same for all values
            xi_data[param_idx, value_idx, :] = base_xi * (1 + 0.05 * np.random.randn(40))
        else:
            # Create parameter-specific variations
            param_factor = (value_idx / 9.0)  # 0 to 1 range
            
            if param_idx == 1:  # Ω_m effect
                amplitude_factor = 0.8 + 0.6 * param_factor  # 0.8 to 1.4
                slope_factor = -1.6 - 0.4 * param_factor    # -1.6 to -2.0
            elif param_idx == 2:  # σ_8 effect
                amplitude_factor = 0.5 + 1.0 * param_factor  # 0.5 to 1.5
                slope_factor = -1.8  # Keep slope constant
            elif param_idx == 3:  # h effect
                amplitude_factor = 0.9 + 0.2 * param_factor  # 0.9 to 1.1
                slope_factor = -1.7 - 0.2 * param_factor    # -1.7 to -1.9
            else:  # n_s effect
                amplitude_factor = 0.95 + 0.1 * param_factor  # 0.95 to 1.05
                slope_factor = -1.8 + 0.1 * (param_factor - 0.5)  # -1.75 to -1.85
            
            # Generate xi with parameter-dependent variations
            xi_param = (r_values / 5.0) ** slope_factor * 0.1 * amplitude_factor
            
            # Add some noise and scale-dependent effects
            noise = 0.02 * np.random.randn(40)
            scale_effect = np.sin(np.log10(r_values) * 2) * 0.01 * param_factor
            
            xi_data[param_idx, value_idx, :] = xi_param * (1 + noise + scale_effect)

# Generate mass function data: (5, 10, 35)
m_values = np.logspace(10, 16, 35)  # 10^10 to 10^16 solar masses
base_nm = (m_values / 1e12) ** (-1.3) * np.exp(-(m_values / 1e14)**0.3) * 1e-3

# Initialize n(M) data array
nm_data = np.zeros((5, 10, 35))

# Generate n(M) data for each parameter
for param_idx in range(5):
    for value_idx in range(10):
        if param_idx == 0:  # Fiducial model - same for all values
            nm_data[param_idx, value_idx, :] = base_nm * (1 + 0.05 * np.random.randn(35))
        else:
            # Create parameter-specific variations for mass function
            param_factor = (value_idx / 9.0)  # 0 to 1 range
            
            if param_idx == 1:  # Ω_m effect on mass function
                amplitude_factor = 0.7 + 0.6 * param_factor  # 0.7 to 1.3
                cutoff_factor = 1.0 + 0.3 * param_factor     # mass scale shift
            elif param_idx == 2:  # σ_8 effect on mass function
                amplitude_factor = 0.5 + 1.0 * param_factor  # 0.5 to 1.5
                cutoff_factor = 1.0  # Keep cutoff constant
            elif param_idx == 3:  # h effect on mass function
                amplitude_factor = 0.9 + 0.2 * param_factor  # 0.9 to 1.1
                cutoff_factor = 0.9 + 0.2 * param_factor     # 0.9 to 1.1
            else:  # n_s effect on mass function
                amplitude_factor = 0.95 + 0.1 * param_factor  # 0.95 to 1.05
                cutoff_factor = 1.0 + 0.1 * (param_factor - 0.5)  # 0.95 to 1.05
            
            # Generate n(M) with parameter-dependent variations
            nm_param = (m_values / 1e12) ** (-1.3) * np.exp(-(m_values / (1e14 * cutoff_factor))**0.3) * 1e-3 * amplitude_factor
            
            # Add some noise
            noise = 0.03 * np.random.randn(35)
            nm_data[param_idx, value_idx, :] = nm_param * (1 + noise)

# Store all data
data['xi'] = xi_data
data['nm'] = nm_data
data['r_values'] = r_values
data['m_values'] = m_values
data['param_info'] = param_info

# Create parameter value arrays for each parameter
for i in range(5):
    if i == 0:
        data[f'param{i}'] = np.zeros(10)  # Fiducial is always 0
    else:
        data[f'param{i}'] = np.arange(10)

# Save to HDF5
with h5py.File('data_one.h5', 'w') as f:
    f['xi'] = data['xi']
    f['nm'] = data['nm']
    f['r_values'] = data['r_values']
    f['m_values'] = data['m_values']
    
    # Save parameter arrays
    for i in range(5):
        f[f'param{i}'] = data[f'param{i}']
    
    # Save parameter info as attributes
    for i, info in param_info.items():
        grp = f.create_group(f'param{i}_info')
        grp.attrs['name'] = info['name']
        grp.attrs['description'] = info['description']
        grp.attrs['range_min'] = info['range'][0]
        grp.attrs['range_max'] = info['range'][1]

print("Data generated successfully!")
print(f"ξ(r) data shape: {xi_data.shape}")
print(f"n(M) data shape: {nm_data.shape}")
print("Parameters:")
for i, info in param_info.items():
    print(f"  {i}: {info['name']} - {info['description']}")
print(f"Saved to: data_one.h5")
