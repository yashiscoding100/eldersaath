import os
import codecs

filepath = 'android/app/src/main/java/com/eldersaath/app/PermissionsPlugin.java'

# Read the file
with open(filepath, 'rb') as f:
    content = f.read()

# Strip BOM if it exists
if content.startswith(codecs.BOM_UTF8):
    content = content[len(codecs.BOM_UTF8):]

# Write it back without BOM
with open(filepath, 'wb') as f:
    f.write(content)

print("BOM stripped successfully!")
