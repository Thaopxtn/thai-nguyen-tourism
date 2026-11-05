import urllib.request
import os

images = {
    "den-duom.jpg": "https://upload.wikimedia.org/wikipedia/commons/b/ba/%C4%90%E1%BB%81n_%C4%90u%E1%BB%95m.JPG",
    "chua-hang.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Ho_ca_Chua_Hang_-_Kim_Son_Tu.jpg",
    "hero-babe.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Ba_Be_National_Park_I.jpg",
    "tay-stilt-house.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ba_Be_stilt_houses.JPG"
}

headers = {'User-Agent': 'ThaiNguyenTourismPortal/2.0 (admin@thainguyen.gov.vn)'}

for name, url in images.items():
    path = os.path.join("assets/images", name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            with open(path, "wb") as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {name}: {e}")
