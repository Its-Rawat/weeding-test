import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"C:\Users\Adity\OneDrive\Desktop\DIDI_Wedding"
static_dir = os.path.join(base_dir, "src", "main", "resources", "static")
public_dir = os.path.join(base_dir, "frontend", "public")

videos = [
    "Short_LandingPageVid_15Feb.mp4",
    "Short_LandingPageVid.mp4",
    "gemini_generated_video_b0b01e67.mp4"
]

print("FFmpeg executable:", ffmpeg_exe)

for vid in videos:
    input_path = os.path.join(static_dir, vid)
    if not os.path.exists(input_path):
        input_path = os.path.join(base_dir, vid)
    
    if not os.path.exists(input_path):
        print(f"Skipping {vid}, not found.")
        continue

    temp_out = os.path.join(static_dir, f"faststart_{vid}")
    print(f"\nProcessing {vid} for Fast-Start (moving moov atom to start)...")
    
    # Run ffmpeg -i input -c copy -movflags +faststart temp_out
    cmd = [
        ffmpeg_exe, "-y",
        "-i", input_path,
        "-c", "copy",
        "-movflags", "+faststart",
        temp_out
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0:
        # Check moov atom position
        with open(temp_out, "rb") as f:
            data = f.read(1024 * 512)
            moov_pos = data.find(b"moov")
            print(f"Success! New file created. moov atom position: {moov_pos} (must be near start)")
        
        # Replace original in static_dir
        dest_static = os.path.join(static_dir, vid)
        os.replace(temp_out, dest_static)
        print(f"Replaced {dest_static}")
        
        # Also copy to root base_dir if exists
        dest_base = os.path.join(base_dir, vid)
        if os.path.exists(dest_base):
            with open(dest_static, "rb") as sf, open(dest_base, "wb") as df:
                df.write(sf.read())
            print(f"Updated {dest_base}")
    else:
        print(f"FFmpeg error on {vid}:", res.stderr)

# Extract crisp 1st frame poster from Short_LandingPageVid_15Feb.mp4
source_vid = os.path.join(static_dir, "Short_LandingPageVid_15Feb.mp4")
poster_static = os.path.join(static_dir, "Short_LandingPageVid_poster.jpg")
poster_public = os.path.join(public_dir, "Short_LandingPageVid_poster.jpg")

print("\nExtracting instant first-frame poster image...")
cmd_poster = [
    ffmpeg_exe, "-y",
    "-ss", "00:00:00.100",
    "-i", source_vid,
    "-vframes", "1",
    "-q:v", "3",
    poster_static
]
res_poster = subprocess.run(cmd_poster, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if res_poster.returncode == 0:
    poster_size = os.path.getsize(poster_static)
    print(f"Poster extracted successfully: {poster_static} ({poster_size / 1024:.1f} KB)")
    
    # Copy to frontend/public
    with open(poster_static, "rb") as sf, open(poster_public, "wb") as df:
        df.write(sf.read())
    print(f"Copied poster to {poster_public}")
else:
    print("Poster extraction error:", res_poster.stderr)
