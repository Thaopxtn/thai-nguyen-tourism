import urllib.request
import urllib.parse
import json

def get_file_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ThaiNguyenTourism/1.0 (contact@thainguyen.gov.vn)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for _, p in data['query']['pages'].items():
                if 'imageinfo' in p:
                    return p['imageinfo'][0]['url']
    except Exception as e:
        return None
    return None

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit=5&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ThaiNguyenTourism/1.0 (contact@thainguyen.gov.vn)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = []
            for item in data['query']['search']:
                title = item['title']
                file_url = get_file_url(title)
                if file_url:
                    results.append({'title': title, 'url': file_url})
            return results
    except Exception as e:
        print(f"Error: {e}")
        return []

searches = [
    ("Ba Be Lake", "Ba Be Lake Vietnam"),
    ("Puong Cave", "Puong Cave"),
    ("Dau Dang Waterfall", "Dau Dang"),
    ("Hua Ma Cave", "Hua Ma"),
    ("Nui Coc Lake", "Nui Coc"),
    ("Thai Nguyen Tea", "Thai Nguyen tea"),
    ("Den Duom", "Duong Tu Minh OR Den Duom"),
    ("Chua Hang", "Chua Hang Thai Nguyen"),
    ("Then Singing Tinh Lute", "Hat Then"),
    ("Stilt House", "Ba Be stilt houses")
]

for name, q in searches:
    res = search_commons(q)
    print(f"=== {name} ===")
    for r in res[:2]:
        print(f"  {r['title']} -> {r['url']}")
