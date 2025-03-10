from sklearn.neighbors import NearestNeighbors

# normalize inputs

neighbors = NearestNeighbors(
    n_neighbors = 10, # probably have to turn this up
    radius = 1, # tune this according to input size?
    metric = 'cosine'
)

def get_nearest(points): # returns indices
    return neighbors.kneighbors(points, return_distance=False)