#!/usr/bin/env python3
"""Generate PWA icons from SVG sources"""

import os
from PIL import Image, ImageDraw
from io import BytesIO

# Create base directory
static_dir = os.path.join(os.path.dirname(__file__), 'static')

def create_icon(size, maskable=False):
    """Create a PWA icon with the SoloDev briefcase design"""
    
    # Create image
    img = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Scale factor
    scale = size / 192
    
    # Colors
    primary = (99, 102, 241)  # #6366f1
    dark = (79, 70, 229)      # #4f46e5
    white = (255, 255, 255)
    
    if maskable:
        # For maskable icons, use a circle or simpler shape
        # Draw circle background
        margin = int(size * 0.05)
        draw.ellipse(
            [(margin, margin), (size - margin, size - margin)],
            fill=primary
        )
        # Draw briefcase symbol
        briefcase_x = int(size * 0.3)
        briefcase_y = int(size * 0.35)
        briefcase_w = int(size * 0.4)
        briefcase_h = int(size * 0.3)
        
        # Main briefcase body
        draw.rectangle(
            [(briefcase_x, briefcase_y), (briefcase_x + briefcase_w, briefcase_y + briefcase_h)],
            fill=dark
        )
        # Handle
        handle_y = int(briefcase_y * 0.8)
        draw.arc(
            [(briefcase_x + 5, handle_y), (briefcase_x + briefcase_w - 5, briefcase_y)],
            0, 180,
            fill=white,
            width=int(size * 0.05)
        )
    else:
        # Standard icon - briefcase on white background
        # Briefcase dimensions
        briefcase_x = int(48 * scale)
        briefcase_y = int(60 * scale)
        briefcase_w = int(96 * scale)
        briefcase_h = int(80 * scale)
        
        # Main briefcase body
        draw.rectangle(
            [(briefcase_x, briefcase_y), (briefcase_x + briefcase_w, briefcase_y + briefcase_h)],
            fill=primary,
            outline=primary
        )
        
        # Darker top section
        draw.rectangle(
            [(briefcase_x, briefcase_y), (briefcase_x + briefcase_w, briefcase_y + int(16 * scale))],
            fill=dark
        )
        
        # Handle
        handle_x1 = int(72 * scale)
        handle_y1 = int(40 * scale)
        handle_x2 = int(120 * scale)
        handle_y2 = int(40 * scale)
        
        # Draw arc handle
        draw.arc(
            [(handle_x1 - int(5 * scale), handle_y1), (handle_x2 + int(5 * scale), briefcase_y)],
            0, 180,
            fill=primary,
            width=int(8 * scale)
        )
        
        # Detail dots
        dot_y = int(115 * scale)
        dot_size = int(4 * scale)
        for dot_x in [int(72 * scale), int(96 * scale), int(120 * scale)]:
            draw.ellipse(
                [(dot_x - dot_size, dot_y - dot_size), (dot_x + dot_size, dot_y + dot_size)],
                fill=white
            )
    
    return img

# Generate icons
print("Generating PWA icons...")

# 192x192
icon_192 = create_icon(192)
icon_192.save(os.path.join(static_dir, 'icon-192x192.png'))
print(f"✓ Created icon-192x192.png")

# 192x192 maskable
icon_192_maskable = create_icon(192, maskable=True)
icon_192_maskable.save(os.path.join(static_dir, 'icon-192x192-maskable.png'))
print(f"✓ Created icon-192x192-maskable.png")

# 512x512
icon_512 = create_icon(512)
icon_512.save(os.path.join(static_dir, 'icon-512x512.png'))
print(f"✓ Created icon-512x512.png")

# 512x512 maskable
icon_512_maskable = create_icon(512, maskable=True)
icon_512_maskable.save(os.path.join(static_dir, 'icon-512x512-maskable.png'))
print(f"✓ Created icon-512x512-maskable.png")

print("\n✅ PWA icons generated successfully!")
print(f"Icons saved in: {static_dir}")
