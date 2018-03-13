import csv
import random
import os
import pandas as pd


DATA_DIR = os.path.join('..', 'data')
DATA_CSV_PATH = os.path.join(DATA_DIR, 'NYPD_Complaint_Data_Historic.csv')


def get_murders_simpler(output_file_path, data_file_path, year):
    with open(data_file_path) as f_in, open(output_file_path, 'w') as f_out:
        reader = csv.reader(f_in)
        header = next(reader)
        f_out.write(','.join(header) + '\n')
        for line in reader:
            d = dict(zip(header, line))
            if str(year) in d['CMPLNT_FR_DT'] and 'MURDER' in d['OFNS_DESC']:
                d['HR'] = d['CMPLNT_FR_TM'][:2]
                for h in header + ['HR']:
                    f_out.write(d[h] + ',')
                f_out.write('\n')


# def get_murders(data_file_path, year):
#     df = pd.read_csv(
#         data_file_path,
#         usecols=['CMPLNT_FR_DT', 'CMPLNT_FR_TM',
#                  'KY_CD', 'OFNS_DESC', 'BORO_NM',
#                  'LOC_OF_OCCUR_DESC', 'PREM_TYP_DESC',
#                  'Latitude', 'Longitude'],
#         parse_dates=['CMPLNT_FR_DT', 'CMPLNT_FR_TM'])\
#         [lambda df: df.CMPLNT_FR_DT.dt.year == year]\
#         [lambda df: df.OFNS_DESC.str.contains('MURDER', na=False)]\
#         .assign(hour=lambda df: df.CMPLNT_FR_TM.str[:2].astype(int))
#     return df


def sample(csv, out_csv, portion):
    with open(csv) as in_f, open(out_csv, 'w') as out_f:
        for i, line in enumerate(in_f):
            if i == 0 or random.random() < portion:
                out_f.write(line)


if __name__ == '__main__':
    # sample(DATA_CSV_PATH, os.path.join(DATA_DIR, 'sample.csv'), 0.0001)
    # get_murders(DATA_CSV_PATH, 2016)\
    #     .to_csv(os.path.join(DATA_DIR, 'murders_2016.csv'))
    get_murders_simpler(
        os.path.join(DATA_DIR, 'murders_2016.csv'),
        DATA_CSV_PATH,
        2016)