import os
import csv
import sys
import time
import asyncio
import pandas as pd
from syrics.api import Spotify


async def main():
    # read ./data/cookies
    with open('./data/cookies.txt', 'r') as file:
        cookies = [i.strip() for i in file.readlines()]
        workers = [Spotify(i) for i in cookies]

    # read from ./data/api_lyrics.txt what track_id's have already been read

    num_workers: int = len(workers)
    print('# workers:',num_workers)

    failures: list[int] = [0]*num_workers
    counter: list[int] = [0]*num_workers
    reset_thres: list[int] = [0]*num_workers # if failed 10 requests in a row, pause for 2 minutes
    reset_interval: int = 120
    interval: int = 5

    df = pd.read_csv('./data/data_active.csv', index_col=0)
    q: list[str] = df['track_id'].to_list()[:100]
    print('queue length:',len(q))

    start = time.time()
    counter = 0
    with open('./data/api_lyrics.csv', 'w', encoding='utf-8') as lyrics, open('./data/retries.txt', 'w', encoding='utf-8') as retry:
        lyrics_writer = csv.writer(lyrics, delimiter=', ')
        while q:
            index = counter % num_workers
            track_id = q.pop()
            res = workers[index].get_lyrics(track_id)
            local = []
            
            print(f'{counter} (worker: {index}, track_id: {track_id})')

            if res == None: # failed request or lyrics don't exist
                print('failed')
                failures[index] += 1
                reset_thres[index] += 1
                if reset_thres[index] == 10: # 10 failed requests in a row
                    print(f'passed break threshold. sleeping {reset_interval}')
                    await asyncio.sleep(reset_interval)
                    reset_thres = 0
                retry.write(track_id+'\n')

            else:
                reset_thres[index] = 0 # reset
                for line in res['lyrics']['lines']:
                    local.append(line['words'])
            
            lyrics_writer.writerow([track_id, ' '.join(local)+'\n'])

            counter += 1
            if counter % num_workers == 0: # finished looping, pause
                await asyncio.sleep(interval) # still not sure about this

    print(f'processed {sum(counter)} lyrics in {(time.time()-start)*1000}s with {sum(failures)} failures')
    
if __name__ == '__main__':
    asyncio.run(main())