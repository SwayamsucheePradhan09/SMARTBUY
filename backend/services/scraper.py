import concurrent.futures
from .scrapers.factory import ScraperFactory

class ScraperManager:
    def __init__(self):
        # Factory will handle scraper selection
        pass

    def run_scrapers(self, query, category=None):
        all_results = []
        scrapers = ScraperFactory.get_scrapers(category)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(scrapers), 10)) as executor:
            future_to_scraper = {executor.submit(s.scrape, query): s for s in scrapers}
            
            for future in concurrent.futures.as_completed(future_to_scraper):
                try:
                    res = future.result()
                    if res:
                        all_results.extend(res)
                except Exception as exc:
                    print(f"Scraper generated an exception: {exc}")
        
        # Sort by price
        if not all_results:
            return []

        return sorted(all_results, key=lambda x: x.get("price", 999999))

def scrape_all(query, category=None):
    manager = ScraperManager()
    return manager.run_scrapers(query, category)