from datasets import load_dataset
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import re
import joblib

dataset = load_dataset("adilbekovich/Sentiment140Twitter", split="train")
df = dataset.to_pandas()


def clean_text(text):
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'\W', ' ', text)
    return text.lower()

# Map sentiment to binary classes
def map_sentiment(score):
    return 1 if score == 1 else 0

df['cleaned_text'] = df['text'].apply(clean_text)
df['sentiment_binary'] = df['label'].apply(map_sentiment)

X = df['cleaned_text']
y = df['sentiment_binary']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#logistic regression classifier
model = make_pipeline(TfidfVectorizer(), LogisticRegression(max_iter=1000))

model.fit(X_train, y_train)

y_pred = model.predict(X_test)


accuracy = accuracy_score(y_test, y_pred)
confusion = confusion_matrix(y_test, y_pred)


print("Logistic Regression Results:")
print(f"Accuracy: {accuracy:.4f}")
print("Confusion Matrix:")
print(confusion)
print(classification_report(y_test, y_pred))

# Save the model
joblib.dump(model, 'logistic_regression_sentiment_model.pkl')

# Testing the best model with user input
print("\nEnter text to analyze sentiment (type 'exit' to quit):")
while True:
    text_input = input("Text: ")
    if text_input.lower() == "exit":
        print("Exiting...")
        break

    # Clean the input text using the defined clean_text function
    cleaned_input = clean_text(text_input)

    # Make a prediction with the best model
    prediction = model.predict([cleaned_input])

    # Map prediction to sentiment label
    sentiment_label = "Good" if prediction[0] == 1 else "Poor"

    print(f"The sentiment is: {sentiment_label}")
