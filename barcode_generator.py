import barcode
from barcode.writer import ImageWriter

data=input("Enter the data to generate barcode: ").strip()
file_path = "barcode.png"

code128 = barcode.get_barcode_class('code128')
bc = code128(data, writer=ImageWriter())

saved_path = bc.save(file_path)
print("Barcode was generated and saved to:", saved_path)
