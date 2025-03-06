import os
import time
import asyncio
import pandas as pd
from syrics.api import Spotify

async def main():
    sp = Spotify("AQB0-7Ta_1hi63BM7CXSdhCugk_hOYP63j1WzPgqMlC3ILiPAz4iEVqZmoFw7tGbFRzsMGdd-NpSEJ8J8HNoneo7ncc7fITU6mm8aYxI0hsOTjnoqQO3SSfL1Wo0qwq0bBRPcMQAdAK1F0t-QAEBWF8uRKfdrmS_RvKxsTcbL6s4M-5rhrQbum-zaacFOtXz4qTV3kPYGdXX23E22nw")

    df = pd.read_csv('./data/data_active.csv', index_col=0)
    q: list[str] = df['track_id'].to_list()
    lyrics = [] # list of strings

    #print(len(q))

    q_mini: list[str] = q[:100]
    failures = 0
    counter = 0
    break_thres = 20
    interval = 5
    reset_interval = 120

    with open('./data/api_lyrics.txt', 'w', encoding='utf-8') as lyrics, open('./data/retries.txt', 'w', encoding='utf-8') as retry:
        while q_mini:
            cur = q_mini.pop()
            res = sp.get_lyrics(cur)
            local = []
            # print(counter, cur)

            if res == None: # failed request OR lyrics don't exist
                print('failed:', counter, cur)
                failures += 1
                break_thres -= 1
                if break_thres <= 0: # 20 failed requests in 25 attempts
                    print(f'passed break threshold. sleeping {reset_interval}')
                    await asyncio.sleep(reset_interval)
                    break_thres = 5
                retry.write(cur+'\n')

            else:
                for line in res['lyrics']['lines']:
                    local.append(line['words'])
            
            lyrics.write(' '.join(local)+'\n')
            
            counter += 1
            await asyncio.sleep(interval)
            if counter % 25 == 0:
                print(f'requests made: {counter}, failures: {failures}')
                break_thres = 20
                # print(f'reached rate limit. sleeping {interval}')
                # await asyncio.sleep(interval)

    # # write lyrics
    # df['lyrics'] = lyrics
    # df.to_csv('/data/data_active_lyrics', encoding='utf-8')

    # write retries
    # with open('retries', 'w') as file:
    #     for id in retry:
    #         file.write(id)
    #         file.write('\n')

if __name__ == '__main__':
    asyncio.run(main())