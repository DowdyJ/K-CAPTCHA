echo "Downloading raw data..."
wget https://userinterfaces.aalto.fi/136Mkeystrokes/data/Keystrokes.zip
echo "Download complete."
mv Keystrokes.zip raw/
cd raw
echo "Extracting data..."
unzip -q Keystrokes.zip

for file in Keystrokes/files/*; do
    mv "$file" ./
done

rmdir -p Keystrokes/files/
rm Keystrokes.zip
echo "Finished."
