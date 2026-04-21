def product_schema(product):
    return {
        "name": product["name"],
        "platform": product["platform"],
        "price": product["price"],
        "rating": product.get("rating"),
        "url": product["url"],
        "last_updated": product["last_updated"]
    }