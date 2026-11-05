import urllib.request
import os

images = {
    "babe-lake.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/47/Ba_Be_Lake_6464.jpg",
    "puong-cave.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/71/Puong_Cave%2C_Ba_Be.jpg",
    "hua-ma-cave.png": "https://upload.wikimedia.org/wikipedia/commons/7/77/Hua-Ma-Cave.png",
    "dau-dang-waterfall.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/53/Dau_Dang_Waterfall_-_Near_Ba_Be_Lake_-_Ba_Be_National_Park_-_Vietnam_%2848102296396%29.jpg",
    "phuong-hoang-moga.jpg": "https://images.vietnamtourism.gov.vn/vn/images/ThaiNguyen-HangPhuongHoangJPG.jpg",
    "na-dang-waterfall.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/32/SuoiBabe.jpg",
    "nui-coc-lake.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Nui_Coc_Lake5.jpg",
    "tan-cuong-tea.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Tea_plantation_in_Thai_Nguyen.jpg",
    "den-duom.jpg": "https://upload.wikimedia.org/wikipedia/commons/b/ba/%C4%90%E1%BB%81n_%C4%90u%E1%BB%95m.JPG",
    "chua-hang.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Ho_ca_Chua_Hang_-_Kim_Son_Tu.jpg",
    "hero-babe.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Ba_Be_National_Park_I.jpg",
    "tay-stilt-house.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ba_Be_stilt_houses.JPG",
    "dan-tinh.png": "https://upload.wikimedia.org/wikipedia/commons/4/45/Thai_tinh_tau.png"
}

out_dir = "assets/images"
os.makedirs(out_dir, exist_ok=True)

for name, url in images.items():
    path = os.path.join(out_dir, name)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(path, "wb") as f:
                f.write(content)
            print(f"Downloaded {name} successfully: {len(content)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
