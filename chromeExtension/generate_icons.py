#!/usr/bin/env python3
"""
Generate icons for Base64 Encoder/Decoder Chrome Extension
Creates icon16.png, icon48.png, and icon128.png with tech colors
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create an icon at the specified size"""
    # Create transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Tech color palette - using purple/blue gradient
    # Primary: #667eea (purple-blue)
    # Secondary: #764ba2 (purple)
    # Accent: #4facfe (bright blue)
    
    # For smaller icons, use simpler design
    if size <= 16:
        # Simple geometric design - rounded square with arrow/transform symbol
        margin = 1
        corner_radius = 3
        
        # Background shape - rounded rectangle with gradient effect
        # Top half lighter
        draw.rounded_rectangle(
            [margin, margin, size - margin, size // 2 + 1],
            radius=corner_radius,
            fill=(118, 142, 250, 255)  # Lighter blue
        )
        # Bottom half darker
        draw.rounded_rectangle(
            [margin, size // 2, size - margin, size - margin],
            radius=corner_radius,
            fill=(102, 126, 234, 255)  # #667eea
        )
        
        # Draw a simple bidirectional arrow to represent encode/decode
        center_x = size // 2
        center_y = size // 2
        
        # Left arrow (decode direction)
        arrow_size = 3
        # Arrow body
        draw.line([center_x - 4, center_y, center_x - 1, center_y], 
                 fill=(255, 255, 255, 255), width=1)
        # Arrow head (left)
        draw.polygon([
            (center_x - 4, center_y - 1),
            (center_x - 4, center_y + 1),
            (center_x - 6, center_y)
        ], fill=(255, 255, 255, 255))
        
        # Right arrow (encode direction)
        # Arrow body
        draw.line([center_x + 1, center_y, center_x + 4, center_y], 
                 fill=(255, 255, 255, 255), width=1)
        # Arrow head (right)
        draw.polygon([
            (center_x + 4, center_y - 1),
            (center_x + 4, center_y + 1),
            (center_x + 6, center_y)
        ], fill=(255, 255, 255, 255))
        
        # Center dot
        draw.ellipse([center_x - 1, center_y - 1, center_x + 1, center_y + 1],
                    fill=(255, 255, 255, 255))
    
    elif size <= 48:
        # Medium size - can use text
        margin = 4
        corner_radius = 6
        
        # Background with gradient effect (simulated)
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=corner_radius,
            fill=(102, 126, 234, 255)  # #667eea
        )
        
        # Add subtle inner highlight
        draw.rounded_rectangle(
            [margin + 1, margin + 1, size - margin - 1, size // 2],
            radius=corner_radius - 1,
            fill=(118, 142, 250, 200)  # Lighter blue highlight
        )
        
        # Draw "64" text
        try:
            # Try to use a system font
            font_size = size // 2
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
        
        text = "64"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - 2
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    else:
        # Large size (128px) - full design with gradient background
        margin = 8
        corner_radius = 16
        
        # Create gradient background
        for y in range(size):
            # Gradient from #667eea to #764ba2
            ratio = y / size
            r = int(102 + (118 - 102) * ratio)
            g = int(126 + (75 - 126) * ratio)
            b = int(234 + (162 - 234) * ratio)
            draw.rectangle([0, y, size, y + 1], fill=(r, g, b, 255))
        
        # Add rounded rectangle overlay for cleaner look
        overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=corner_radius,
            fill=(102, 126, 234, 240)  # Semi-transparent purple-blue
        )
        
        # Add highlight
        overlay_draw.rounded_rectangle(
            [margin + 2, margin + 2, size - margin - 2, size // 2 + 10],
            radius=corner_radius - 2,
            fill=(118, 142, 250, 150)  # Lighter highlight
        )
        
        # Composite overlay
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)
        
        # Draw "64" text with larger font
        try:
            font_size = size // 2
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
        
        text = "64"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - 4
        
        # Add text shadow for depth
        draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 100), font=font)
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
        
        # Add small "B" prefix for Base64 (optional, subtle)
        try:
            small_font_size = size // 6
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", small_font_size)
        except:
            try:
                small_font = ImageFont.truetype("arial.ttf", small_font_size)
            except:
                small_font = ImageFont.load_default()
        
        bbox_small = draw.textbbox((0, 0), "B", font=small_font)
        small_text_width = bbox_small[2] - bbox_small[0]
        small_text_height = bbox_small[3] - bbox_small[1]
        small_text_x = text_x - small_text_width - 4
        small_text_y = text_y + (text_height - small_text_height) // 2
        
        draw.text((small_text_x, small_text_y), "B", fill=(255, 255, 255, 200), font=small_font)
    
    # Save the image
    img.save(output_path, 'PNG')
    print(f"Created {output_path} ({size}x{size})")

def main():
    """Generate all icon sizes"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generate icons
    sizes = [16, 48, 128]
    for size in sizes:
        output_path = os.path.join(script_dir, f"icon{size}.png")
        create_icon(size, output_path)
    
    print("\nAll icons generated successfully!")
    print("Icons created:")
    print("  - icon16.png (16x16) - Toolbar icon")
    print("  - icon48.png (48x48) - Extension management")
    print("  - icon128.png (128x128) - Chrome Web Store")

if __name__ == "__main__":
    main()

