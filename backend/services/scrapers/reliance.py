import requests
from bs4 import BeautifulSoup
from datetime import datetime

class RelianceScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }

    def scrape(self, query):
        url = f"https://www.reliancedigital.in/search?q={query.replace(' ', '%20')}:relevance"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, "html.parser")
            results = []
            
            items = soup.select("div.sp__product")[:5]
            
            for item in items:
                try:
                    title_el = item.select_one("p.sp__name")
                    price_el = item.select_one("span.gsp__price")
                    img_el = item.select_one("img")
                    link_el = item.select_one("a")
                    
                    if title_el and price_el:
                        price_str = price_el.text.replace("₹", "").replace(",", "").strip()
                        results.append({
                            "name": title_el.text.strip(),
                            "platform": "Reliance Digital",
                            "price": int(price_str.split(".")[0]),
                            "image": "https://www.reliancedigital.in" + img_el["data-srcset"].split(",")[0].split()[0] if img_el and img_el.get("data-srcset") else None,
                            "url": "https://www.reliancedigital.in" + link_el["href"] if link_el else None,
                            "rating": "4.3",
                            "last_updated": datetime.utcnow().isoformat()
                        })
                except:
                    continue
            
            return results
        except Exception as e:
            print(f"Reliance Scraping Error: {e}")
            return None
