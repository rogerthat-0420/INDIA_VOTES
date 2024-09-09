import pandas as pd

def convert_to_dict(df):
    all_data = {}
    for index, row in df.iterrows():
        year = row['year']
        if pd.notnull(year):  # Check if year is not NaN
            year = str(int(year))  # Convert year to integer and then to string
            state = row['state'].strip()  # Extract and strip the state name
            turnout = row['Turnout']
            # Check if turnout is a valid numeric value
            if isinstance(turnout, str) and turnout.replace(',', '').replace('.', '').isdigit():
                turnout = float(turnout.replace(',', ''))  # Remove commas and convert to float
                # If turnout is already a numeric type, no need to convert
                if year not in all_data:
                    all_data[year] = {}  # Initialize dictionary for the year if not present
                if state not in all_data[year]:
                    all_data[year][state] = []  # Initialize list for state if not present
                all_data[year][state].append(turnout)  # Add turnout to the list for the state
    # Calculate average turnout for each state in each year
    for year, states in all_data.items():
        for state, turnouts in states.items():
            all_data[year][state] = sum(turnouts) / len(turnouts)
    return all_data


def main():
    # Read the CSV file into a DataFrame
    df = pd.read_csv("modified_data.csv")

    # Convert DataFrame to the desired dictionary format
    all_data = convert_to_dict(df)

    # Print the dictionary
    print("var allData = {")
    for year, data in all_data.items():
        print(f"  '{year}': {data},")
    print("}")

if __name__ == "__main__":
    main()
