import h5py
import numpy as np



 # The galaxy clustering data
 ## This is a 5D array with dimensions (10, 10, 10, 10, 40)
# The first four dimensions represents different parameters or features,
# and the last dimension represents the galaxy clustering at different scales. \xi(r)
data = {}
data['xi'] = np.random.rand(10, 10, 10, 10, 40)
data['param1'] = np.arange(10)
data['param2'] = np.arange(10)
data['param3'] = np.arange(10)
data['param4'] = np.arange(10)


with h5py.File('data.h5', 'w') as f:

    f['xi'] = data['xi']
    f['param1'] = data['param1']
    f['param2'] = data['param2']
    f['param3'] = data['param3']
    f['param4'] = data['param4']