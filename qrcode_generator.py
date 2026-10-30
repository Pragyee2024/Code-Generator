import qrcode

url = input("Enter the URL to generate QR code: ").strip()
file_path = "qrcode.png"

qr = qrcode.QRCode()
qr.add_data(url)

img = qr.make_image()
img.save(file_path)
print("QR Code was generated and saved to:", file_path)
