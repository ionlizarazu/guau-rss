"""
    Get and parse GUAU platform home and found pages searching for series
"""
import json

import requests

RSS_URL = "https://guau.eus/series/{}/rss.xml"


def extract(obj, res):
    """Extracts data from an object to add it to the series"""

    serie_id = str(obj.get("series", ""))
    collection_name = obj.get("collection", None)
    if serie_id and not res.get(serie_id, None):
        res[serie_id] = {
            "rss": RSS_URL.format(serie_id),
        }

    if collection_name == "series":
        res[serie_id]["title"] = obj.get("title")
        res[serie_id]["description"] = obj.get("description")
        res[serie_id]["media_type"] = obj.get("media_type")
        images = obj.get("images", [])
        for img in images:
            if img.get("format", 0) == 7:
                res[serie_id]["img"] = img.get("file")

    elif serie_id and collection_name == "media":
        res[serie_id]["media_title"] = obj.get("title")
        res[serie_id]["media_desc"] = obj.get("description")
        res[serie_id]["media_type"] = obj.get("media_type")


pages = {}
series = {}
with open("./src/assets/rss.json", "r", encoding="utf-8") as series_file:
    series = json.load(series_file)

result = requests.get("https://guau.eus/api/v1/home", timeout=5000)
if result.ok:
    json_home = json.loads(result.text)
    children = json_home.get("children")
    for child in children:
        if child.get("page"):
            pages[child.get("page")] = {"title": child.get("title")}
        extract(child, series)
        child_children = child.get("children")
        if child_children:
            for child_child in child_children:
                if child_child.get("page"):
                    pages[child_child.get("page")] = {
                        "title": child_child.get("title")
                    }
                extract(child_child, series)

    for page in pages:
        page_result = requests.get(
            f"https://guau.eus/api/v1/pages/{page}", timeout=5000
        )
        if page_result.ok:
            json_page = json.loads(page_result.text)
            children = json_page.get("children")
            page_title = json_page.get("title")
            page_id = json_page.get("id")
            for child in children:
                child_children = child.get("children")
                if child_children:
                    for child_child in child_children:
                        extract(child_child, series)


with open("./src/assets/rss.json", "w", encoding="utf-8") as series_file:
    json.dump(series, series_file)
