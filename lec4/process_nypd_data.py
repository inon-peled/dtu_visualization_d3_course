import os
import pandas as pd


DATA_CSV_PATH = os.path.join('data', 'NYPD_Complaint_Data_Historic.csv')


def excerpt(num_rows, data_csv_path, out_file_path):
    pd.read_csv(
        data_csv_path,
        nrows=num_rows
    ).to_csv(out_file_path)


def total_per_borough(data_csv_path, year, out_file_folder):
    return pd.read_csv(
        data_csv_path,
        usecols=['BORO_NM', 'RPT_DT'],
        parse_dates=['RPT_DT']
    )\
        [lambda df: df.RPT_DT.dt.year == year]\
        ['BORO_NM']\
        .value_counts()\
        .to_csv(os.path.join(out_file_folder, 'total_per_borough_%d.csv' % year))


if __name__ == '__main__':
    # excerpt(100, DATA_CSV_PATH, os.path.join('data', 'excerpt.csv'))
    total_per_borough(DATA_CSV_PATH, 2016, 'data')
