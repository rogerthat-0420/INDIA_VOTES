import pandas as pd

# Read the CSV file
data = pd.read_csv("data.csv")

# Remove commas from the "Turnout" column
data['Turnout'] = data['Turnout'].str.replace(' %', '')

# Save the modified data to a new CSV file
data.to_csv("modified_data.csv", index=False)

print("Modification completed. Output saved to 'modified_data.csv'.")
