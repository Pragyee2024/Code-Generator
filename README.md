# QR-Code-Generator

A collection of QR code and barcode generators.

## Contents

| Path | What it is |
|------|------------|
| `QR-Code-Generator/` | Web app that generates QR codes in the browser |
| `qrcode_generator.py` | Python script that generates a QR code from a URL or text |
| `barcode_generator.py` | Python script that generates a Code 128 barcode |

## Web app

Open `QR-Code-Generator/index.html` in a browser. No install is needed, and it works offline (the fonts fall back to system fonts).

Features:
- Live preview as you type
- Custom code and background colors
- Adjustable size and error correction level
- Square, rounded or dot modules
- Download as PNG or SVG, or copy the image
- Warnings for low contrast and text that is too long

## Python scripts

Install the dependencies:

```bash
pip install qrcode pillow python-barcode
```

Run a script and enter your text when prompted:

```bash
python qrcode_generator.py
python barcode_generator.py
```

The output is saved in the current folder as `qrcode.png` or `barcode.png`.

## Credits

- QR encoding in the web app: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase (MIT license)
