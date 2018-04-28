REM Set IM to the fully qualified path to 'magick.exe'
set IM="C:\Program Files (x86)\ImageMagick-7.0.7-Q8\magick.exe"
cd gallery
md C
md S
md M
md L
md X
for %%f in (*.jpg) DO %IM% %%f -resize 60 C\%%f
for %%f in (*.jpg) DO %IM% %%f -resize 140 S\%%f
for %%f in (*.jpg) DO %IM% %%f -resize 300 M\%%f
for %%f in (*.jpg) DO %IM% %%f -resize 800 L\%%f
for %%f in (*.jpg) DO %IM% %%f -resize 1920 X\%%f
cd ..