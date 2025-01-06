import json
import re

# Attempt reading with a specific encoding
try:
    with open("words_100k.txt", "r", encoding="utf-8") as file:
        words = file.read().splitlines()
except UnicodeDecodeError:
    print("UTF-8 decoding failed. Trying Latin-1.")
    with open("words_100k.txt", "r", encoding="latin-1") as file:
        words = file.read().splitlines()

# Function to check if a word is valid
def is_valid_word(word):
    # Remove words with apostrophes or special characters (letters only)
    return re.fullmatch(r"[a-zA-Z]+", word)

# Filter words to remove unwanted ones
filtered_words = [word for word in words if is_valid_word(word)]

# Convert the list to a dictionary
words_dict = {word: 1 for word in filtered_words}

# Save as JSON
with open("words.json", "w", encoding="utf-8") as json_file:
    json.dump(words_dict, json_file, indent=4)

print("Conversion successful.")

