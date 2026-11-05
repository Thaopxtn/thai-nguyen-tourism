import urllib.request
import urllib.parse
import json

def get_wiki_page_images(title):
    url = f"https://vi.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages|images&pithumbsize=1000&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ThaiNguyenTourism/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            res = {}
            for k, v in pages.items():
                if 'thumbnail' in v:
                    res['thumbnail'] = v['thumbnail']['source']
                if 'images' in v:
                    res['images'] = [img['title'] for img in v['images']]
            return res
    except Exception as e:
        return {'error': str(e)}

articles = [
    "Hồ Ba Bể",
    "Động Puông",
    "Thác Đầu Đẳng",
    "Động Hua Mạ",
    "Hồ Núi Cốc",
    "Đền Đuổm",
    "Chùa Hang (Thái Nguyên)",
    "Chùa Phù Liễn",
    "Chè Thái Nguyên",
    "Thái Nguyên",
    "An toàn khu Định Hóa",
    "Võ Nhai",
    "Hát Then",
    "Bánh chưng Bờ Đậu"
]

results = {}
for art in articles:
    info = get_wiki_page_images(art)
    results[art] = info

with open("wiki_page_images.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Done querying Wikipedia articles!")
