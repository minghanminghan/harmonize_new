from flask import Flask, request
from flask_cors import CORS, cross_origin
import pandas as pd
from sklearn.neighbors import NearestNeighbors


# TODO: normalize inputs
neighbors = NearestNeighbors(
    n_neighbors = 10, # probably have to turn this up
    radius = 1, # tune this according to input size?
    metric = 'cosine'
)

def get_nearest(points): # returns indices
    return neighbors.kneighbors(points, return_distance=False)

data = pd.read_csv('./data/data_active.csv', encoding='utf-8', index_col=0)
neighbors.fit(data.drop(labels=['track_id', 'track_name'], axis=1))



# server for retrieving nearest neighbors
app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.get('/')
def hello():
    return 'service is running!'

@app.post("/rec")
def recommend():
    ids = request.json['ids']
    points = data[data['track_id'].isin(ids)].drop(['track_id', 'track_name'], axis=1)
    print(ids)
    print(points)
    try:
        nn = get_nearest(points)
        return { 'ids': data.iloc[nn[0]].to_dict() } # ndarray serialization issue,
    except:
        return { 'error': 'not enough songs in database' }


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=4002, debug=True)