# 📦 Hive Assets

This folder contains all the visual assets for the Hive app.

---

## Required Assets

The following assets are needed for the app to work properly:

### 1. App Icon (`icon.png`)
- **Size:** 1024x1024 px
- **Format:** PNG with transparency
- **Design:** Baby pink background (#FFB7C5) with white bee or chat bubble icon
- **Usage:** App icon on home screen

### 2. Splash Screen (`splash.png`)
- **Size:** 1242x2436 px (iPhone X resolution)
- **Format:** PNG
- **Design:** Baby pink background with Hive logo and tagline
- **Usage:** Loading screen when app starts

### 3. Adaptive Icon (`adaptive-icon.png`)
- **Size:** 1024x1024 px
- **Format:** PNG with transparency
- **Design:** Same as icon.png but with safe zone (inner 768x768)
- **Usage:** Android adaptive icon

### 4. Favicon (`favicon.png`)
- **Size:** 48x48 px
- **Format:** PNG
- **Design:** Simplified version of app icon
- **Usage:** Web version favicon

---

## Creating Assets

### Quick Option: Use Placeholders

For development, you can use solid color placeholders:

1. Create 1024x1024 baby pink square for `icon.png`
2. Create 1242x2436 baby pink rectangle for `splash.png`
3. Copy `icon.png` to `adaptive-icon.png`
4. Resize `icon.png` to 48x48 for `favicon.png`

### Professional Option: Design Custom Assets

Use tools like:
- **Figma** (free, web-based)
- **Canva** (free templates)
- **Adobe Illustrator** (professional)
- **Sketch** (Mac only)

#### Design Guidelines:
- Use Hive color palette (see below)
- Keep it simple and recognizable
- Ensure good contrast
- Test at small sizes

---

## Color Palette

Use these colors for consistency:

```
Primary (Baby Pink):    #FFB7C5
Accent (Soft Rose):     #F4A3B3
Background (Cream):     #FFF5F6
Text (Deep Rose):       #774454
White:                  #FFFFFF
```

---

## Icon Ideas

### Option 1: Bee Icon 🐝
- Simple bee silhouette
- Baby pink background
- White bee shape
- Rounded corners

### Option 2: Chat Bubble 💬
- Speech bubble shape
- Baby pink fill
- White outline
- Minimalist design

### Option 3: Hexagon Pattern 🔷
- Honeycomb hexagons
- Baby pink gradient
- Modern geometric
- Unique and memorable

### Option 4: Letter H
- Stylized "H" for Hive
- Rounded, friendly font
- Baby pink with white letter
- Simple and clean

---

## Splash Screen Design

### Layout:
```
┌─────────────────────┐
│                     │
│                     │
│       [ICON]        │  ← App icon (200x200)
│                     │
│        Hive         │  ← App name (48px, bold)
│                     │
│  Connect Your Crew, │  ← Tagline (16px)
│    Your Way.        │
│                     │
│                     │
└─────────────────────┘
```

### Colors:
- Background: #FFB7C5 (baby pink)
- Text: #FFFFFF (white)
- Icon: White with pink background

---

## Asset Generators

### Online Tools:
1. **App Icon Generator**
   - https://appicon.co/
   - Upload 1024x1024 image
   - Generates all sizes

2. **Expo Asset Generator**
   - https://buildicon.netlify.app/
   - Specifically for Expo apps
   - Creates icon and splash

3. **Figma Templates**
   - Search "app icon template"
   - Free community templates
   - Export at required sizes

---

## File Structure

```
assets/
├── icon.png              # 1024x1024 - App icon
├── splash.png            # 1242x2436 - Splash screen
├── adaptive-icon.png     # 1024x1024 - Android adaptive
├── favicon.png           # 48x48 - Web favicon
└── README.md             # This file
```

---

## Testing Assets

### Preview Icon:
1. Build app with `eas build`
2. Install on device
3. Check home screen icon

### Preview Splash:
1. Close and reopen app
2. Watch loading screen
3. Check for distortion

### Preview Adaptive Icon (Android):
1. Long-press app icon
2. Check circular crop
3. Ensure important elements visible

---

## Updating Assets

After changing assets:

```bash
# Clear cache
npm start --clear

# Or rebuild
eas build --platform all
```

---

## Tips

1. **Keep it simple** - Icons should be recognizable at small sizes
2. **Use vectors** - SVG or high-res PNG for scaling
3. **Test on device** - Emulators don't always show true colors
4. **Safe zones** - Keep important elements in center 80%
5. **Consistency** - Match app's baby pink theme

---

## Resources

- **Expo Asset Guide:** https://docs.expo.dev/guides/assets/
- **Icon Design Guide:** https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Material Design Icons:** https://material.io/design/iconography
- **Free Icons:** https://www.flaticon.com/

---

## Quick Start (Temporary Assets)

If you want to start immediately without custom assets:

1. Create solid baby pink images at required sizes
2. Add white text "Hive" in center
3. Use until you create proper designs

This will work for development and testing!

---

**Need help with assets? Use online generators or hire a designer on Fiverr!**

🐝 **Hive** - *Connect Your Crew, Your Way.*
