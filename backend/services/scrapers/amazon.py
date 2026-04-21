import requests
from bs4 import BeautifulSoup
from datetime import datetime
import random

class AmazonScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": random.choice([
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            ]),
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/"
        }

    def scrape(self, query):
        url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, "html.parser")
            results = []
            
            items = soup.select("div[data-component-type='s-search-result']")[:5]
            
            for item in items:
                try:
                    title_el = item.select_one("h2 span")
                    price_el = item.select_one(".a-price-whole")
                    img_el = item.select_one("img.s-image")
                    link_el = item.select_one("h2 a")
                    rating_el = item.select_one("span.a-icon-alt")
                    
                    if title_el and price_el:
                        price_str = price_el.text.replace(",", "").strip()
                        results.append({
                            "name": title_el.text.strip(),
                            "platform": "Amazon",
                            "price": int(price_str.split(".")[0]),
                            "image": img_el["src"] if img_el else None,
                            "url": "https://www.amazon.in" + link_el["href"] if link_el else None,
                            "rating": rating_el.text.split()[0] if rating_el else "4.0",
                            "last_updated": datetime.utcnow().isoformat()
                        })
                except Exception as e:
                    print(f"Error parsing Amazon item: {e}")
                    continue
            
            return results
        except Exception as e:
            print(f"Amazon Scraping Error: {e}")
            return None
