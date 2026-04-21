import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
CACHE_EXPIRY = int(os.getenv("CACHE_EXPIRY", 3600))