import urllib.request
import os

images = {
    "atk-dinh-hoa.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/59/ATK_Dinh_Hoa.jpg",
    "tay-house-dinh-hoa.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg",
    "cua-tu-stream.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Kem_stream_Thai_Nguyen.jpg",
    "chua-hang-real.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/81/Hang_pagoda_Thai_Nguyen.jpg",
    "banh-chung.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Banh_Chung_in_Vietnam.jpg"
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
