# pip install pandas 
import pandas as pd

# Read the csv file
df = pd.read_csv('merged.csv', encoding= 'utf-8', low_memory=False)

# Print it out if you want
print(df)
