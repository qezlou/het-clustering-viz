import h5py
import numpy as np

# Set seed for reproducible data
np.random.seed(42)

# The galaxy clustering data
# This is a 5D array with dimensions (10, 10, 10, 10, 40)
# The first four dimensions represents different parameters or features,
# and the last dimension represents the galaxy clustering at different scales. \xi(r)
data = {}

# Generate realistic-looking correlation function data
r_values = np.logspace(-1, 2, 40)  # 0.1 to 100 Mpc/h

# Generate xi data with parameter dependencies
xi_data = np.zeros((10, 10, 10, 10, 40))
for i in range(10):
    for j in range(10):
        for k in range(10):
            for l in range(10):
                # Base power law correlation function
                base_xi = (r_values / 5.0) ** (-1.8) * 0.1
                
                # Add parameter-dependent variations
                param_effect = (i/9.0 + j/9.0 + k/9.0 + l/9.0) / 4.0
                amplitude_factor = 0.7 + 0.6 * param_effect
                slope_factor = -1.6 - 0.4 * param_effect
                
                # Generate modified correlation function
                xi_param = (r_values / 5.0) ** slope_factor * 0.1 * amplitude_factor
                
                # Add realistic noise
                noise = 0.02 * np.random.randn(40)
                xi_data[i, j, k, l, :] = xi_param * (1 + noise)

data['xi'] = xi_data

# Generate halo mass function data n(M)
# Mass values from 10^10 to 10^16 solar masses
m_values = np.logspace(10, 16, 35)

# Generate n(M) data with parameter dependencies  
nm_data = np.zeros((10, 10, 10, 10, 35))
for i in range(10):
    for j in range(10):
        for k in range(10):
            for l in range(10):
                # Base Sheth-Tormen-like mass function
                base_nm = (m_values / 1e12) ** (-1.3) * np.exp(-(m_values / 1e14)**0.3) * 1e-3
                
                # Add parameter-dependent variations
                param_effect = (i/9.0 + j/9.0 + k/9.0 + l/9.0) / 4.0
                amplitude_factor = 0.8 + 0.4 * param_effect
                cutoff_factor = 1.0 + 0.5 * param_effect
                
                # Generate modified mass function
                nm_param = (m_values / 1e12) ** (-1.3) * np.exp(-(m_values / (1e14 * cutoff_factor))**0.3) * 1e-3 * amplitude_factor
                
                # Add realistic noise
                noise = 0.05 * np.random.randn(35)
                nm_data[i, j, k, l, :] = nm_param * (1 + noise)

data['nm'] = nm_data
data['r_values'] = r_values
data['m_values'] = m_values
data['param1'] = np.arange(10)
data['param2'] = np.arange(10)
data['param3'] = np.arange(10)
data['param4'] = np.arange(10)


with h5py.File('data.h5', 'w') as f:
    f['xi'] = data['xi']
    f['nm'] = data['nm']
    f['r_values'] = data['r_values']
    f['m_values'] = data['m_values']
    f['param1'] = data['param1']
    f['param2'] = data['param2']
    f['param3'] = data['param3']
    f['param4'] = data['param4']

print("Data generated successfully!")
print(f"ξ(r) data shape: {data['xi'].shape}")
print(f"n(M) data shape: {data['nm'].shape}")
print(f"r values: {len(data['r_values'])} points from {data['r_values'][0]:.2f} to {data['r_values'][-1]:.1f} Mpc/h")
print(f"M values: {len(data['m_values'])} points from {data['m_values'][0]:.1e} to {data['m_values'][-1]:.1e} M_sun")