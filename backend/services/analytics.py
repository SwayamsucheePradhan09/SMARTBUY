class AnalyticsEngine:
    @staticmethod
    def generate_advice(query, results):
        if not results:
            return None
            
        cheapest = results[0]
        platforms = [r['platform'] for r in results]
        
        advice = f"I've scanned {len(set(platforms))} platforms for '{query}'. "
        
        if cheapest['platform'] == 'Meesho':
            advice += "Meesho offers the lowest price, but check quality reviews for fashion items."
        elif cheapest['platform'] == 'Amazon':
            advice += "Amazon has the best price and likely the fastest delivery."
        elif "Myntra" in platforms or "AJIO" in platforms:
            fashion_cheapest = next((r for r in results if r['platform'] in ['Myntra', 'AJIO']), None)
            if fashion_cheapest:
                advice += f"For fashion-conscious shoppers, {fashion_cheapest['platform']} has curated selections at ₹{fashion_cheapest['price']}."
        
        if any(r.get('is_global') for r in results):
            advice += " Global options from Temu are available but may take longer to ship."
            
        return advice

    @staticmethod
    def get_price_trend(price):
        # Generate a simulated historical trend
        import random
        return [price + random.randint(-100, 200) for _ in range(7)]
