from datetime import datetime


today = datetime(2025, 1, 7)
later_date = datetime(2023, 5, 23)

difference = later_date - today

print(f"Difference in days: {difference.days}")