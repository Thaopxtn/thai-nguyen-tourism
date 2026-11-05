import urllib.request
import urllib.parse
import json

def get_file_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ThaiNguyenTourism/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for _, p in data['query']['pages'].items():
                if 'imageinfo' in p and p['imageinfo']:
                    return p['imageinfo'][0]['url']
    except Exception as e:
        return None
    return None

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit=4&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ThaiNguyenTourism/1.0'})
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
        return []

searches = [
    ("hua_ma", "Dong Hua Ma OR Hua Ma cave"),
    ("den_duom", "Đền Đuổm OR Den Duom"),
    ("chua_hang", "Chùa Hang Thái Nguyên OR Chua Hang"),
    ("chua_phu_lien", "Phù Liễn OR Phu Lien"),
    ("mo_ga", "Suối Mỏ Gà OR Hang Phượng Hoàng"),
    ("hat_then", "Hát Then OR Đàn Tính"),
    ("na_dang", "Thác Nà Đăng OR Thác Nà Khoang"),
    ("banh_chung_bo_dau", "Bánh chưng Bờ Đậu OR Bờ Đậu"),
    ("com_lam", "Cơm lam"),
    ("tam_dao_hoang_nong", "Đại Từ Thái Nguyên OR Cửa Tử")
]

out = {}
for key, q in searches:
    res = search_commons(q)
    out[key] = res

with open("real_images.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("Saved to real_images.json successfully")
