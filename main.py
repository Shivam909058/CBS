from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, validator
from typing import List, Dict, Optional
from PIL import Image
import os
import re
from fastapi.middleware.cors import CORSMiddleware
import joblib
import logging
from io import BytesIO
import requests
import geocoder
import google.generativeai as genai
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# CORS configuration
origins = [
    "http://localhost:3000",
    "https://your-production-frontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Generative AI API
os.environ["API_KEY"] = ""  # Replace with your actual API key
genai.configure(api_key=os.environ["API_KEY"])
genai_model = genai.GenerativeModel("gemini-1.5-flash")

# Load the sentiment analysis model
sentiment_model = joblib.load("logistic_regression_sentiment_model.pkl")

# Recycling rules (add more rules as needed)
RECYCLING_RULES = {
        "Maharashtra": [
        "Separate waste at source into wet, dry, and hazardous categories.",
        "Ensure plastics are clean and dry before disposal.",
        "E-waste should be disposed of through authorized e-waste collection centers.",
        "Use bins provided by local authorities for proper segregation."
    ],
    "Delhi": [
        "Use separate bins for dry waste (plastic, paper, metal) and wet waste (food scraps).",
        "Compost kitchen waste to reduce landfill burden.",
        "Recycle paper products and avoid mixing recyclables with non-recyclables.",
        "Participate in local clean-up drives and awareness programs."
    ],
    "Karnataka": [
        "Sort waste into dry and wet categories at home before disposal.",
        "Use designated collection bins for e-waste and ensure safe disposal.",
        "Encourage local recycling initiatives and community clean-ups.",
        "Ensure that plastic containers are rinsed and cleaned before recycling."
    ],
    "Tamil Nadu": [
        "Rinse all plastic bottles and containers before disposal.",
        "Separate recyclable materials (metals, plastics, paper) from non-recyclables.",
        "Participate in local waste segregation workshops.",
        "Avoid single-use plastics and prefer biodegradable options."
    ],
    "West Bengal": [
        "Recyclables should be clean and dry; food residue can contaminate materials.",
        "E-waste must be collected and disposed of through authorized channels.",
        "Use community recycling drives to promote awareness.",
        "Segregate hazardous waste (batteries, chemicals) separately."
    ],
    "Gujarat": [
        "Flatten cardboard boxes to save space in recycling bins.",
        "Avoid the use of plastic bags; use cloth bags instead.",
        "Participate in local recycling programs and educational initiatives.",
        "Dispose of electronic waste at designated centers only."
    ],
    "Rajasthan": [
        "Source segregation of waste into biodegradable and non-biodegradable materials.",
        "Participate in community awareness programs about recycling.",
        "Ensure waste is dry and clean before disposal in recycling bins.",
        "Compost organic waste at home to reduce landfill use."
    ],
    "Andhra Pradesh": [
        "Recyclables should be kept dry; wet items can lead to contamination.",
        "Follow local guidelines for electronic waste disposal.",
        "Engage in community-led recycling efforts and campaigns.",
        "Avoid mixing recyclables with general waste."
    ],
    "Telangana": [
        "Use separate bins for recyclables and ensure they are clean.",
        "Participate in local recycling drives and educational workshops.",
        "Check with local authorities about e-waste collection schedules.",
        "Be aware of local regulations regarding hazardous waste disposal."
    ],
    "Uttar Pradesh": [
        "Sort waste at home into recyclables and non-recyclables.",
        "Consult local agencies for the proper disposal of hazardous materials.",
        "Participate in community initiatives for waste management and recycling.",
        "Use recyclable materials wherever possible to reduce waste."
    ]

}

# Initialize the FastAPI app
app = FastAPI()

# Define input data models
class Feedback(BaseModel):
    text: str

class ImageInput(BaseModel):
    urls: List[str]

    @validator('urls')
    def validate_urls(cls, v):
        if not v:
            raise ValueError('At least one URL must be provided')
        for url in v:
            if not url.startswith(('http://', 'https://')):
                raise ValueError(f'Invalid URL format: {url}')
        return v

class LocationService:
    """Handle location-related operations"""

    @staticmethod
    def get_location() -> Dict[str, str]:
        """Get user's location with fallback options"""
        try:
            logging.info("Attempting IP geolocation...")
            g = geocoder.ip("me")
            if g.ok:
                return {
                    "city": g.city or "Unknown",
                    "state": g.state or "Unknown",
                    "country": g.country or "India"
                }
            raise Exception("Geolocation failed")
        except Exception as e:
            logging.warning(f"Location detection failed: {str(e)}. Using default values.")
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India"
            }


# Helper function for cleaning text
def clean_text(text):
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"\W", " ", text)
    return text.lower()


# Endpoint for sentiment analysis
@app.post("/analyze-feedback/")
async def analyze_feedback(feedback: Feedback):
    """
    Analyze the sentiment of the provided feedback text.
    """
    try:
        # Clean and predict sentiment
        cleaned_text = clean_text(feedback.text)
        prediction = sentiment_model.predict([cleaned_text])[0]
        sentiment = True if prediction == 1 else False
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint for scrap classification
@app.post("/classify-scrap/")
async def classify_scrap(image_input: ImageInput):
    """
    Classify scrap items based on image URLs and user location.
    """
    try:
        print(image_input.urls)
        # Get user location
        location = LocationService.get_location()
        state = location.get("state", "Maharashtra")

        classifications = []

        for url in image_input.urls:
            # Download the image from the URL
            response = requests.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to fetch image from URL: {url}")

            # Open the image using PIL
            image = Image.open(BytesIO(response.content))

            # Create the prompt for Generative AI
            prompt = f"""
            This image shows an item the user wishes to sell to a local scrap collector in {state}, India. Based on the object in the image, classify:
            1. Whether this item is recyclable according to {state} recycling guidelines.
            2. If the item can be sold to a scrap collector or has potential resale value.
            3. Specific recommendations on how the user should prepare this item before handing it over to the vendor, such as cleaning, drying, or segregating it to maximize resale value and ensure compliance with local recycling rules.
            4. Practical advice on safe handling and storage of this item at home, considering {state} regulations on waste management.
            """

            # Generate classification with Generative AI
            response = genai_model.generate_content([prompt, image])

            # Parse response and append to results
            classifications.append({
                "image_url": url,
                "recyclable": "recyclable" in response.text.lower(),
                "sellable": "sellable" in response.text.lower(),
                "recommendation": response.text,
                "recycling_rules": RECYCLING_RULES.get(state, ["No specific rules found for this state."])
            })

        return classifications  # Return the entire list of classifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing images: {str(e)}")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)