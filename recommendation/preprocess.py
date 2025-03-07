import os
import pandas as pd

output = 'data_active.csv'

df = pd.DataFrame()

path = os.path.join(os.getcwd(), 'recommendation', 'data')
walk = os.walk(path).__next__()

for file in walk[2]: # get all files
    if file == output:
        continue
    df = pd.concat([df, pd.read_csv(os.path.join(path, file))])

# every column has track_id (great!)

# drop any column with null values
df.dropna(axis=1, thresh=150000, inplace=True)

# drop dupliate track_id
df.drop_duplicates(subset='track_id', inplace=True)

df.dropna(axis=0, how='any', inplace=True)

df.to_csv(os.path.join(path, output))