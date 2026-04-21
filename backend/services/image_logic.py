import os

class ImageProcessor:
    def __init__(self):
        # In a production app, we would load an ML model or use Tesseract OCR here
        pass

    def detect_product(self, file_path):
        """
        Simulated image recognition.
        Extracts search query based on filename or metadata.
        """
        filename = os.path.basename(file_path).lower()
        
        # Simple rule-based extraction for the demo
        words = filename.replace("_", " ").replace("-", " ").split(".")
        potential_name = words[0]
        
        # Cleanup common image prefixes
        prefixes = ["img", "photo", "image", "screenshot"]
        for p in prefixes:
            if potential_name.startswith(p):
                potential_name = potential_name.replace(p, "").strip()
        
        if not potential_name or potential_name.isdigit():
            return "iPhone 15" # Default for demo if unrecognizable
            
        return potential_name.title()

def get_product_query(file_path):
    processor = ImageProcessor()
    return processor.detect_product(file_path)
