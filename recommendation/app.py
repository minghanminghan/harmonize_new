from flask import Flask, request
from flask_cors import CORS, cross_origin
from recommender import neighbors, get_nearest
import pandas as pd


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
@cross_origin()
def recommend():
    ids = request.json['ids']
    points = data[data['track_id'].isin(ids)].drop(['track_id', 'track_name'], axis=1)
    print(ids)
    print(points)
    try:
        nn = get_nearest(points)
        return { 'distance': nn[0] } # ndarray serialization issue, 
    except:
        return { 'error': 'not enough songs in database' }


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=4002, debug=True)