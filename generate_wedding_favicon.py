import math
from PIL import Image, ImageDraw, ImageFilter

def create_wedding_favicon():
    # Supersampling 4x for crystal clear antialiasing (1024x1024 -> 512x512)
    s = 1024
    cx, cy = s // 2, s // 2
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Royal Crimson Medallion Background with radial glow
    max_r = 480
    for r in range(max_r, 0, -2):
        t = r / max_r
        # Center: #A11D2A (161, 29, 42), Edge: #480A10 (72, 10, 16)
        cr = int(161 * (1 - t*0.5) + 72 * (t*0.5))
        cg = int(29 * (1 - t*0.5) + 10 * (t*0.5))
        cb = int(42 * (1 - t*0.5) + 16 * (t*0.5))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb, 255))

    # 2. Luxury Gold Outer Border & Pearl Ring
    draw.ellipse([cx - max_r, cy - max_r, cx + max_r, cy + max_r], outline=(212, 175, 55, 255), width=16)
    inner_ring_r = 450
    draw.ellipse([cx - inner_ring_r, cy - inner_ring_r, cx + inner_ring_r, cy + inner_ring_r], outline=(255, 235, 150, 200), width=6)

    # Filigree Pearls along the border
    for angle in range(0, 360, 10):
        rad = math.radians(angle)
        px = cx + int((inner_ring_r + 15) * math.cos(rad))
        py = cy + int((inner_ring_r + 15) * math.sin(rad))
        draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=(255, 245, 185, 240))

    # Helper function to draw a stylized curved flower petal
    def draw_petal(angle_deg, length, width, fill_color, outline_color, outline_width=6):
        rad = math.radians(angle_deg)
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)
        
        # Base, tip, left wing, right wing
        tip_x = cx + int(length * cos_a)
        tip_y = cy + int(length * sin_a)
        
        # Wing perpendiculars
        perp_x = -sin_a
        perp_y = cos_a
        
        mid_x = cx + int(length * 0.55 * cos_a)
        mid_y = cy + int(length * 0.55 * sin_a)
        
        left_x = mid_x + int(width * perp_x)
        left_y = mid_y + int(width * perp_y)
        right_x = mid_x - int(width * perp_x)
        right_y = mid_y - int(width * perp_y)
        
        # Polynomial bezier-like curve points
        points = []
        # Base to left
        for step in range(11):
            t = step / 10.0
            x = (1-t)**2 * cx + 2*(1-t)*t * (left_x * 0.8 + cx * 0.2) + t**2 * left_x
            y = (1-t)**2 * cy + 2*(1-t)*t * (left_y * 0.8 + cy * 0.2) + t**2 * left_y
            points.append((x, y))
        # Left to tip
        for step in range(1, 11):
            t = step / 10.0
            x = (1-t)**2 * left_x + 2*(1-t)*t * (tip_x + perp_x*width*0.3) + t**2 * tip_x
            y = (1-t)**2 * left_y + 2*(1-t)*t * (tip_y + perp_y*width*0.3) + t**2 * tip_y
            points.append((x, y))
        # Tip to right
        for step in range(1, 11):
            t = step / 10.0
            x = (1-t)**2 * tip_x + 2*(1-t)*t * (tip_x - perp_x*width*0.3) + t**2 * right_x
            y = (1-t)**2 * tip_y + 2*(1-t)*t * (tip_y - perp_y*width*0.3) + t**2 * right_y
            points.append((x, y))
        # Right to base
        for step in range(1, 11):
            t = step / 10.0
            x = (1-t)**2 * right_x + 2*(1-t)*t * (right_x * 0.8 + cx * 0.2) + t**2 * cx
            y = (1-t)**2 * right_y + 2*(1-t)*t * (right_y * 0.8 + cy * 0.2) + t**2 * cy
            points.append((x, y))
            
        draw.polygon(points, fill=fill_color)
        if outline_color and outline_width > 0:
            draw.line(points + [points[0]], fill=outline_color, width=outline_width, joint="curve")

    # 3. Layer 1 (Outer Petals): 8 Large Royal Lotus Petals
    for i in range(8):
        angle = i * 45
        draw_petal(
            angle_deg=angle,
            length=380,
            width=100,
            fill_color=(190, 40, 65, 230), # Soft crimson rose
            outline_color=(212, 175, 55, 255), # Gold outline
            outline_width=8
        )

    # 4. Layer 2 (Middle Petals): 8 Interlocking Golden-Rose Petals
    for i in range(8):
        angle = i * 45 + 22.5
        draw_petal(
            angle_deg=angle,
            length=310,
            width=85,
            fill_color=(225, 75, 95, 240), # Vibrant bridal pink-red
            outline_color=(255, 220, 120, 255), # Bright gold
            outline_width=7
        )

    # 5. Layer 3 (Inner Blooming Blossom): 8 Delicate Petals
    for i in range(8):
        angle = i * 45
        draw_petal(
            angle_deg=angle,
            length=220,
            width=65,
            fill_color=(245, 120, 140, 250), # Luminous rose
            outline_color=(255, 240, 170, 255),
            outline_width=6
        )

    # 6. Floral Heart (Gold Center Ring & Rosette)
    heart_r = 110
    draw.ellipse([cx - heart_r, cy - heart_r, cx + heart_r, cy + heart_r], 
                 fill=(220, 160, 40, 255), outline=(255, 245, 190, 255), width=8)
                 
    inner_heart_r = 75
    draw.ellipse([cx - inner_heart_r, cy - inner_heart_r, cx + inner_heart_r, cy + inner_heart_r], 
                 fill=(255, 215, 80, 255), outline=(255, 255, 230, 255), width=6)

    # Center Crown Diamond / Star
    star_r = 45
    star_points = [
        (cx, cy - star_r),
        (cx + star_r * 0.3, cy - star_r * 0.3),
        (cx + star_r, cy),
        (cx + star_r * 0.3, cy + star_r * 0.3),
        (cx, cy + star_r),
        (cx - star_r * 0.3, cy + star_r * 0.3),
        (cx - star_r, cy),
        (cx - star_r * 0.3, cy - star_r * 0.3)
    ]
    draw.polygon(star_points, fill=(255, 255, 255, 255), outline=(212, 175, 55, 255))
    
    # Tiny golden pearls around heart
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        px = cx + int((heart_r - 18) * math.cos(rad))
        py = cy + int((heart_r - 18) * math.sin(rad))
        draw.ellipse([px - 8, py - 8, px + 8, py + 8], fill=(255, 255, 220, 255))

    # Downsample to 512x512 with high quality Lanczos resampling for ultra-smooth edges
    final_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    
    return final_512

if __name__ == "__main__":
    img = create_wedding_favicon()
    
    # Save standard resolutions
    img.save("frontend/public/favicon.png", "PNG")
    img.save("frontend/public/pwa-192x192.png", "PNG")
    img.save("frontend/public/pwa-512x512.png", "PNG")
    
    # Multi-resolution ICO (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save("frontend/public/favicon.ico", format="ICO", sizes=ico_sizes)
    
    print("Favicon files generated successfully in frontend/public/")
