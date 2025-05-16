from transformers import pipeline

model = pipeline("summarization", model="facebook/bart-large-cnn")

import nltk
nltk.download('shakespeare')

from nltk.corpus import shakespeare
print(shakespeare.fileids())  # List of available works

# Example: print first 20 lines of a play (e.g., "hamlet")
lines = shakespeare.words('hamlet.xml')
print(' '.join(lines[:100]))

text=' '.join(lines[:10000])

response = model(text)
print(response)