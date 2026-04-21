import requests
from bs4 import BeautifulSoup
from datetime import datetime

class CromaScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }

    def scrape(self, query):
        url = f"https://www.croma.com/searchB?q={query.replace(' ', '%20')}:relevance"
        # Note: Croma often requires JS rendering or uses an API. 
        # This is a simplified fallback.
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, "html.parser")
            results = []
            
            items = soup.select("li.product-item")[:5]
            
            for item in items:
                try:
                    title_el = item.select_one("h3")
                    price_el = item.select_one("span.amount")
                    img_el = item.select_one("img")
                    link_el = item.select_one("a")
                    
                    if title_el and price_el:
                        price_str = price_el.text.replace("₹", "").replace(",", "").strip()
                        results.append({
                            "name": title_el.text.strip(),
                            "platform": "Croma",
                            "price": int(price_str.split(".")[0]),
                            "image": img_el["src"] if img_el else None,
                            "url": "https://www.croma.com" + link_el["href"] if link_el else None,
                            "rating": "4.1",
                            "last_updated": datetime.utcnow().isoformat()
                        })
                except:
                    continue
            
            return results
        except Exception as e:
            print(f"Croma Scraping Error: {e}")
            return None
