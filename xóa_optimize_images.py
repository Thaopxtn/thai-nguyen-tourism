import os
from PIL import Image

img_dir = "assets/images"
for f in os.listdir(img_dir):
    if not (f.endswith(".jpg") or f.endswith(".png") or f.endswith(".JPG")):
        continue
    path = os.path.join(img_dir, f)
    try:
        size_before = os.path.getsize(path)
        im = Image.open(path)
        # Convert RGBA to RGB if saving as JPEG
        if im.mode in ("RGBA", "P"):
            # keep png if it needs transparency like dan-tinh.png
            if "dan-tinh" in f:
                im.thumbnail((800, 800), Image.Resampling.LANCZOS)
                im.save(path, optimize=True)
                continue
            im = im.convert("RGB")
        # Resize if width > 1600
        if im.width > 1600 or im.height > 1600:
            im.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        
        # Save optimized
        target_path = path if not f.endswith(".png") else path.replace(".png", ".jpg")
        im.save(target_path, "JPEG", quality=84, optimize=True)
        if target_path != path:
            os.remove(path)
        size_after = os.path.getsize(target_path)
        print(f"Optimized {f}: {size_before // 1024}KB -> {size_after // 1024}KB")
    except Exception as e:
        print(f"Error on {f}: {e}")
