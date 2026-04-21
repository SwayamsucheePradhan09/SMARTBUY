import requests
from bs4 import BeautifulSoup
from datetime import datetime
import random

class FlipkartScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": random.choice([
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0",
            ]),
            "Accept-Language": "en-US,en;q=0.5",
        }

    def scrape(self, query):
        url = f"https://www.flipkart.com/search?q={query.replace(' ', '%20')}"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, "html.parser")
            results = []
            
            # Flipkart has different layouts. 
            # Layout 1: Usually for electronics/mobiles
            items = soup.select("div._1AtVbE") 
            
            for item in items:
                try:
                    # Mobile/Laptop Layout
                    title_el = item.select_one("div._4rR01T")
                    price_el = item.select_one("div._30jeq3")
                    img_el = item.select_one("img._396cs4")
                    link_el = item.select_one("a._1fQZEK")
                    rating_el = item.select_one("div._3LWZlK")

                    # Grid Layout (Clothing/Accessories)
                    if not title_el:
                        title_el = item.select_one("a.s1Q9rs") or item.select_one("a.IRpwTa")
                        price_el = item.select_one("div._30jeq3")
                        img_el = item.select_one("img._396cs4") or item.select_one("img._2r_T1I")
                        link_el = item.select_one("a.s1Q9rs") or item.select_one("a._2Uzu5h")

                    if title_el and price_el:
                        price_str = price_el.text.replace("₹", "").replace(",", "").strip()
                        results.append({
                            "name": title_el.text.strip(),
                            "platform": "Flipkart",
                            "price": int(price_str),
                            "image": img_el["src"] if img_el else None,
                            "url": "https://www.flipkart.com" + link_el["href"] if link_el and link_el.get("href") else None,
                            "rating": rating_el.text.strip() if rating_el else "4.2",
                            "last_updated": datetime.utcnow().isoformat()
                        })
                        if len(results) >= 5: break
                except Exception as e:
                    continue
            
            return results
        except Exception as e:
            print(f"Flipkart Scraping Error: {e}")
            return None
