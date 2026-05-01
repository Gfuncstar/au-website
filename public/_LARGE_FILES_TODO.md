# Large media files — not yet shipped

Three files are too large for direct git commit (>100MB GitHub limit). They live in `clone-aesthetics-unlocked/assets/` only.

| File | Size | Where it goes |
|------|-----:|---------------|
| `BRAND_SOCIAL_FoundationFlourishing_compilation.mp4` | 520 MB | Brand social compilation — uncertain placement, low priority |
| `5K12_M02_Branding_TALKINGHEAD_branding3.mp4` | 405 MB | 5K+ Formula Module 2 sales-page sample |
| `5K12_M00_Welcome_LESSON_motivationmindset_CONFIRM.mp4` | 184 MB | 5K+ Formula Welcome — needs `_CONFIRM` audit anyway |

## Two ways to ship them

### Option 1 — Compress to web-friendly bitrates
Re-encode to 1080p H.264 at 2-3 Mbps. Typical command:
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium -vf "scale=-2:1080" -acodec aac -b:a 128k output.mp4
```
Likely outcome: 184MB → ~50MB. 405MB → ~100MB (might still be over). 520MB → ~200MB (still over).

### Option 2 — Vercel Blob storage
The Vercel-native CDN for big assets. Files served via signed URLs, deliver from Vercel's edge:
```bash
npm i @vercel/blob
```
Then upload via `vercel blob put <file>` and reference the returned URL in components. $0.15/GB stored, $0.045/GB egress. Free tier covers small projects.

### Recommendation
- Option 1 for the 184MB Welcome video (will compress under 100MB)
- Option 2 for the 405MB Branding talking head and 520MB compilation (compression won't get them under 100MB without quality loss)

## Once shipped

Add a hard link from `clone-aesthetics-unlocked/assets/videos/.../FILENAME.mp4` into `public/video/.../` and remove this file's row above.
