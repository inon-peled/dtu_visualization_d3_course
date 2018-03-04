import re
import os
import pandas as pd

DATA_DIR = os.path.join('..', 'data')
DATA_CSV_PATH = os.path.join(DATA_DIR, 'NYPD_Complaint_Data_Historic.csv')


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


def pd_desc_count():
    def lazy_flat_map(df):
        for row in map(lambda pair: pair[1], df.iterrows()):
            if type(row.PD_DESC) == str:
                for e in row.PD_DESC.split(','):
                    trimmed = re.sub(r'[^a-zA-Z- ]', '', e).strip()
                    if trimmed:
                        yield row['year'], row['month'], trimmed

    df = pd.read_csv(
        DATA_CSV_PATH,
        usecols=['PD_DESC', 'RPT_DT'],
        parse_dates=['RPT_DT']
    ) \
        .assign(year=lambda df: df.RPT_DT.dt.year,
                month=lambda df: df.RPT_DT.dt.month)\
        .drop('RPT_DT', axis=1)
    pd.DataFrame(lazy_flat_map(df))\
        .rename(columns={0: 'year', 1: 'month', 2: 'crime'})\
        .groupby(['year', 'month', 'crime'])\
        .size()\
        .to_csv(os.path.join(DATA_DIR, 'crime_count_per_month.csv'))


def top_crimes(crimes_path, year, num_top, out_file_folder):
    return pd.read_csv(crimes_path)\
        [lambda df: df.year == year]\
        .set_index(['year', 'crime'])\
        .groupby('month')['count']\
        .nlargest(num_top)\
        .unstack()\
        .to_csv(os.path.join(out_file_folder,
                             'top_%d_crimes_%d.csv' % (num_top, year)))


if __name__ == '__main__':
    # excerpt(100, DATA_CSV_PATH, os.path.join('data', 'excerpt.csv'))
    # total_per_borough(DATA_CSV_PATH, 2016, 'data')
    # pd_desc_count()
    top_crimes(os.path.join(DATA_DIR, 'crime_count_per_month.csv'), 2016, 5, DATA_DIR)