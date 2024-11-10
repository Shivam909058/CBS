import joblib
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load the pre-trained Logistic Regression model
model = joblib.load('logistic_regression_sentiment_model.pkl')

# Load the dataset for testing
dataset = load_dataset("adilbekovich/Sentiment140Twitter", split="test")
df = dataset.to_pandas()

# Clean text function (same as before)
def clean_text(text):
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'\W', ' ', text)
    return text.lower()

# Apply cleaning to the test data
df['cleaned_text'] = df['text'].apply(clean_text)

# Test data
X_test = df['cleaned_text']
y_test = df['label'].apply(lambda x: 1 if x == 1 else 0)  # Map sentiment to binary classes (1 = positive, 0 = negative)

# Make predictions on the test data
y_pred = model.predict(X_test)

# Calculate and print the accuracy, confusion matrix, and classification report
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

# Output results
print("Accuracy: {:.4f}".format(accuracy))
print("Confusion Matrix:")
print(conf_matrix)
print("Classification Report:")
print(class_report)

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
    #print(f"The sentiment is: {sentiment_label}")

    if sentiment_label == "Good":
        print("Sentiment: 1")
    else:
        print("Sentiment: 0")