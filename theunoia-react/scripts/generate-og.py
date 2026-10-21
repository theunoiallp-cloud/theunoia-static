from PIL import Image, ImageDraw, ImageFont
import os

width = 1200
height = 630

# Create base image in RGB (navy #0F1B2D)
img = Image.new("RGBA", (width, height), (15, 27, 45, 255))
draw = ImageDraw.Draw(img)

# Draw subtle ambient background accents
# Soft radial or decorative rectangles
draw.rectangle([(0, 0), (width, height)], fill=(15, 27, 45, 255))

# Subtle decorative gradient / warm aura circle in top right
aura = Image.new("RGBA", (width, height), (0, 0, 0, 0))
aura_draw = ImageDraw.Draw(aura)
aura_draw.ellipse([(850, -100), (1350, 400)], fill=(201, 165, 92, 18))
aura_draw.ellipse([(900, -50), (1300, 350)], fill=(194, 101, 63, 14))
aura_draw.ellipse([(-150, 350), (350, 850)], fill=(26, 42, 66, 100))
img = Image.alpha_composite(img, aura)
draw = ImageDraw.Draw(img)

# Luxury double border frame
gold = (201, 165, 92, 220)
gold_faint = (201, 165, 92, 60)
draw.rectangle([(28, 28), (width - 28, height - 28)], outline=gold_faint, width=1)
draw.rectangle([(36, 36), (width - 36, height - 36)], outline=gold, width=2)

# Corner decorative accents
corner_len = 24
# Top-left
draw.line([(32, 36), (32 + corner_len, 36)], fill=gold, width=3)
draw.line([(36, 32), (36, 32 + corner_len)], fill=gold, width=3)
# Top-right
draw.line([(width - 36 - corner_len, 36), (width - 32, 36)], fill=gold, width=3)
draw.line([(width - 36, 32), (width - 36, 32 + corner_len)], fill=gold, width=3)
# Bottom-left
draw.line([(32, height - 36), (32 + corner_len, height - 36)], fill=gold, width=3)
draw.line([(36, height - 36 - corner_len), (36, height - 32)], fill=gold, width=3)
# Bottom-right
draw.line([(width - 36 - corner_len, height - 36), (width - 32, height - 36)], fill=gold, width=3)
draw.line([(width - 36, height - 36 - corner_len), (width - 36, height - 32)], fill=gold, width=3)

# Load and place logo
logo_path = "theunoia-react/public/assets/logo.png"
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    # Original is 438 x 88. Scale proportionally to width 440
    target_w = 440
    target_h = int(logo.height * (target_w / logo.width))
    logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    img.paste(logo, (90, 110), logo)

# Try loading system font or fallback
def get_font(size, bold=False):
    font_paths = [
        "C:\\Windows\\Fonts\\georgiab.ttf" if bold else "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

title_font = get_font(52, bold=True)
subtitle_font = get_font(26, bold=False)
badge_font = get_font(20, bold=True)
url_font = get_font(22, bold=False)

# Draw Title
cream = (250, 247, 240, 255)
gold_solid = (201, 165, 92, 255)
muted = (180, 190, 205, 255)

draw.text((90, 250), "Where young talent builds the future.", fill=cream, font=title_font)

# Draw Subtitle
draw.text((90, 335), "Software Development · Web Applications · Digital Platforms", fill=gold_solid, font=subtitle_font)

# Horizontal subtle divider line
draw.line([(90, 420), (width - 90, 420)], fill=(201, 165, 92, 80), width=1)

# Bottom row: pill badges & domain
# Domain badge
draw.text((90, 480), "THEUNOiA.COM", fill=cream, font=badge_font)
draw.text((90, 515), "Bharat's Student-First Digital Innovation Ecosystem", fill=muted, font=url_font)

# Right side: Hunhar · Hivh · Digital Solutions
draw.text((width - 440, 495), "HUNHAR  ·  HIVH  ·  MAKER LAB", fill=gold_solid, font=badge_font)

# Convert to RGB and save
out_img = img.convert("RGB")
out_path = "theunoia-react/public/assets/og-image.png"
out_img.save(out_path, format="PNG", quality=95)
print(f"Generated {out_path} ({width}x{height}) successfully!")
