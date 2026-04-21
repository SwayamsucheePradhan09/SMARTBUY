from flask import Blueprint, request, jsonify
from services.scraper import scrape_all
from services.analytics import AnalyticsEngine

search_bp = Blueprint("search", __name__)

@search_bp.route("/search", methods=["POST", "OPTIONS"])
def search_product():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    query = data.get("query")
    category = data.get("category", "All")
    
    if not query:
        return jsonify({"error": "Query required"}), 400

    results = scrape_all(query, category)
    
    # Enrich with Analytics
    advice = AnalyticsEngine.generate_advice(query, results)
    
    # Add trend data to each result
    for r in results:
        r['trend'] = AnalyticsEngine.get_price_trend(r['price'])

    return jsonify({
        "results": results,
        "advice": advice
    })