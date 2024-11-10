import google.generativeai as genai
import os
import logging
import geocoder
from PIL import Image
from typing import Dict, List

os.environ["API_KEY"] = "HeyUseYourApi"
genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel("gemini-1.5-flash")


class LocationService:
    """Handle location-related operations"""

    @staticmethod
    def get_location() -> Dict[str, str]:
        """Get user's location with fallback options"""
        try:
            # Try manual input first
            print("\nEnter location details (press Enter to use IP geolocation):")
            city = input("City (or press Enter): ").strip()
            state = input("State (or press Enter): ").strip()

            if city and state:
                logging.info(f"Using manual location input: {city}, {state}")
                return {
                    "city": city,
                    "state": state,
                    "country": "India"
                }

            # Try IP geolocation
            logging.info("Attempting IP geolocation...")
            g = geocoder.ip('me')
            if g.ok:
                location = {
                    "city": g.city or "Unknown",
                    "state": g.state or "Unknown",
                    "country": g.country or "India"
                }
                logging.info(f"Location detected via IP: {location}")
                return location

            raise Exception("Geolocation failed")

        except Exception as e:
            logging.warning(f"Location detection failed: {str(e)}. Using default values.")
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India"
            }


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


def classify_scrap(images: List[str], location: Dict[str, str]):
    """
    Classifies images as recyclable or non-recyclable and sellable or non-sellable
    based on Indian state-specific scrap rules.

    Parameters:
    images (list): List of image file paths
    location (dict): User location with city and state

    Returns:
    list: A list of dictionaries containing classification and recommendations
    """
    classifications = []

    # Get the state from the location
    state = location.get("state", "Maharashtra")  # Default to Maharashtra if state is not found

    for image_path in images:
        # Open the image file
        image = Image.open(image_path)

        # Prepare the prompt with location-specific information
        prompt = f"""
        This image shows an item the user wishes to sell to a local scrap collector in {state}, India. Based on the object in the image, classify:

        1. Whether this item is recyclable according to {state} recycling guidelines.
        2. If the item can be sold to a scrap collector or has potential resale value.
        3. Specific recommendations on how the user should prepare this item before handing it over to the vendor, such as cleaning, drying, or segregating it to maximize resale value and ensure compliance with local recycling rules.
        4. Practical advice on safe handling and storage of this item at home, considering {state} regulations on waste management.

        Ensure that the response is straightforward and useful for the user, offering clear steps for handling this item in preparation for local collection.
        """

        # Generate classification and recommendation using text-and-image input
        response = model.generate_content([prompt, image])

        # Parse the response and store it in the results list
        classifications.append({
            "image": image_path,
            "recyclable": "recyclable" in response.text.lower(),
            "sellable": "sellable" in response.text.lower(),
            "recommendation": response.text,
            "recycling_rules": RECYCLING_RULES.get(state, "No specific rules found for this state.")
        })

    return classifications


# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    # Get the user's location
    location = LocationService.get_location()

    # Example images to classify
    images = ["iron1.jpg","cell_phone.webp","ttp2.jpg"] #Replace with actual image paths

    # Classify scrap based on the images and user's location
    classifications = classify_scrap(images, location)

    # Output the results
    for result in classifications:
        print(f"Image: {result['image']}")
        print(f"Recyclable: {result['recyclable']}")
        print(f"Recommendation: {result['recommendation']}")
        print(f"Recycling Rules: {result['recycling_rules']}\n")
