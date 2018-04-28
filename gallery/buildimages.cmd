for %%f in (*.jpg) DO magick %%f -resize 60 C\%%f
for %%f in (*.jpg) DO magick %%f -resize 140 S\%%f
for %%f in (*.jpg) DO magick %%f -resize 300 M\%%f
for %%f in (*.jpg) DO magick %%f -resize 800 L\%%f
for %%f in (*.jpg) DO magick %%f -resize 1920 X\%%f