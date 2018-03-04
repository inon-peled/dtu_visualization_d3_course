import os
import pandas as pd


def total_per_borough():
    return pd.read_csv(
        os.path.join('data', 'NYPD_Complaint_Data_Historic.csv'),
        usecols=['BORO_NM']
    )\
        ['BORO_NM']\
        .value_counts()


if __name__ == '__main__':
    total_per_borough().to_csv(
        os.path.join('data', 'total_per_borough.csv'))
