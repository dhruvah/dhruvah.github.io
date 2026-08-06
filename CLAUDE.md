# dhruvah.github.io: working context

Personal portfolio for Harsh Dhruva, robotics engineer. Static site, no build step,
no framework, no dependencies. Plain HTML + one CSS file + one JS file.

Named `CLAUDE.md` so Claude Code loads it automatically. Note this repo is **public**.

---

## Layout

```
index.html          Home: hero, Selected work, Home lab, Academic
about.html          Bio, education, resume link
timeline.html       Every project in chronological order, with per-project dates
projects/*.html     34 pages
assets/css/main.css ~1170 lines, all styling
assets/js/main.js   Injects nav + footer on every page (not fetched, so file:// works)
assets/media/<project>/   Images and video, one directory per project
assets/media/thumbs/      72x48 thumbnails, timeline only
favicon.svg + PNGs, apple-touch-icon.png, assets/media/og-image.png
```

Deployed by GitHub Pages from `main`. **Every push is a deploy.** No staging.

### Page types

| type | markup | width | examples |
|---|---|---|---|
| hub / index | `<article class="project-page hub">` | 1100px | `cmu.html`, `computer-vision.html`, `timeline.html` |
| project detail | `<article class="project-page">` | 720px | everything else |

Hubs put their cards in `<div class="projects-grid hub-grid">` (3 columns, 2 under 980px,
1 under 620px). Detail pages keep prose at 720px for line length.

Hierarchy is home → hub → detail, max two clicks. Hubs: `cmu`, `rose-hulman`,
`computer-vision` (6), `slam-mini-projects` (4), `planning` (3), `home-lab` (3).

---

## Conventions

**No em dashes or en dashes anywhere.** Author preference, applied site-wide and
repeatedly re-checked. Use a colon for an appositive, a comma mid-sentence, "to" in
ranges ("2020 to 2022"), and `·` as a separator in titles and category lines.
Verify with `grep -rn '—\|–' --include='*.html' --include='*.css' .` before pushing.

- Page title: `Name · Harsh Dhruva`
- Category line above `<h1>`: `Context · Institution` or `Mini project N · CMU 16-833`
- Cards: `.project-card`, add `.featured` to span 2 columns
- Card thumbnails: plain `<img>`, or `.thumb-mosaic` (6-image grid + circular logo badge),
  or `.thumb-logo-pair` (two logos side by side)
- Figures: `.fig-row` (2 col) or `.fig-row.one` (1 col)
- Tables: `<table class="data-table">` inside `<div class="data-table-wrap">`;
  `.factor` on the label column, `.pass` / `.fail` / `.untested` on outcomes
- References: `<ol class="references">` with an optional `<span class="ref-note">`
- Video: always `preload="none"` plus a `poster`, or a page with six clips costs megabytes

---

## Gotchas that cost real time

**Small images get upscaled and look blurry.** `.fig-row figure img { width: 100% }`
stretches any image to the column. A 395px-wide diagram in a 720px column is a 1.8x
upscale. Always check native size and cap it:

```html
<figure class="fig-row one" style="max-width: 395px; margin: 2rem auto;">
```

**A grid that silently collapses to one column.** `.project-page` is 720px with
`box-sizing: border-box` and 2rem padding, so the content box is 656px. A
`minmax(320px, 1fr)` grid needs 664px and quietly drops to one column instead of
erroring. That is what `.hub` (1100px) exists for.

**zsh eats `$var:` .** `"scale=$sz:$sz:flags=lanczos"` becomes garbage because zsh
applies history modifiers to a bare `$var:`. Always `${sz}`.

**This machine has no PIL, no ImageMagick, and ffmpeg without `drawtext`.**
To render text into an image, author SVG and rasterize through Quick Look:

```bash
qlmanage -t -s 1200 -o . file.svg     # then crop the result
```

Quick Look **stretches non-square SVGs**. Author on a square canvas with the artwork in
the top region, then crop. A square canvas renders 1:1, verified by calibration.

**Pushing.** No SSH key is loaded, and large pushes fail with HTTP 400 unless the
post buffer is raised:

```bash
git -c credential.helper='!gh auth git-credential' \
    -c http.postBuffer=524288000 \
    push https://github.com/dhruvah/dhruvah.github.io.git main
```

The `origin` remote is still SSH and is deliberately left alone.

**Deploys take 45 to 90 seconds.** Verify against the live URL with a cache buster,
never trust the browser:

```bash
curl -s "https://dhruvah.github.io/page.html?cb=$RANDOM" | grep -c 'the new thing'
```

Several times a change was reported as broken when it was live and the browser was
serving cache. Favicons and OG images cache hardest; LinkedIn needs its Post Inspector
to re-scrape.

---

## Editorial direction, learned from feedback

These came from the author correcting drafts. They are worth following.

1. **Lead with the picture.** Several pages buried their first image behind five
   sections of prose. Show what the thing is, then explain it.
2. **Results over storytelling.** Cut meta-commentary: "which is where it gets
   interesting", "the one I keep coming back to", "worth stating plainly". State the
   finding.
3. **No name-dropping.** "NASA-sponsored" was removed from every intro and summary; it
   survives only on the research project page where the funding is real context, and on
   MoonRanger where NASA cFS is an actual dependency.
4. **Be candid about failures.** The pages are strongest where they say what did not
   work. Do not tidy that away.
5. **No internal jargon.** "This page's siblings" describes the file layout, not
   anything a reader can see. Name the pages and link them.
6. **Avoid long scrolls.** Grids over stacked lists.

---

## Verification before pushing

```bash
# broken internal links, per page depth
for f in *.html projects/*.html; do d=$(dirname "$f")
  grep -oE '(src|href)="\.\.?/[^"]+"' "$f" | sed -E 's/^(src|href)="//; s/"$//' \
  | sort -u | while read p; do [ -e "$d/$p" ] || echo "MISSING in $f -> $p"; done
done

# orphaned media
for a in assets/media/*/*; do grep -q "$(basename $a)" projects/*.html *.html || echo "UNUSED $a"; done

# dashes
grep -rn '—\|–' --include='*.html' --include='*.css' --include='*.js' .

# local preview
python3 -m http.server 8765
```

A link checker will read inside HTML comments. A "broken" link was reported several
times that was actually commented out.

---

## Media pipeline

Source video is often hundreds of MB. Encode before committing:

```bash
ffmpeg -i in.mp4 -an -vf "scale=900:-2:flags=lanczos" -c:v libx264 -crf 30 \
       -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -ss 5 -i out.mp4 -frames:v 1 -q:v 5 out-poster.jpg
```

Targets: 0.6 to 2.5 MB per clip, images under ~500KB. Media is currently 74MB total.
One source set went 797MB to 21MB this way.

Photos may carry no EXIF orientation while having rotated pixels; `sips` and ffmpeg
disagree about them. Strip metadata with `-map_metadata -1` and rotate at pixel level.

---

## Current state

37 pages. Home, about, timeline, 34 project pages. Favicon is a gold `HD` monogram on
the accent red. OG image is a six-tile colour mosaic at `assets/media/og-image.png`,
linked from `index.html` and `about.html` only.

The desk cleanup page (`projects/home-desk-cleanup.html`) carries findings from a direct
analysis of the HuggingFace datasets: 99/100 grasp detection without a force sensor,
and `shoulder_pan` 10.3x tighter at place than at pick, which is the pouch memorisation
visible in training data. Joint figures are **LeRobot normalised units, never degrees**.

### Open items

- `assets/harsh-dhruva-resume.pdf` contains a personal phone number and is publicly
  crawlable. The author was told; a redacted web version was offered and not requested.
- `huggingface.co/hdhruva/pi05-libero-finetuned-...` returns 401. That button on the
  desk cleanup page will not work for visitors.
- Five open questions to the analysis author about the desk cleanup numbers: whether
  3.6x was pooled across both tasks of `cleandesk_pen_in_pouch`, which dataset episodes
  0/7/91 come from, whether that dataset trained any policy, which session the 1.32
  held-width figure uses, and whether `desk_cleanup_v2_pen_multi` was also fixed-length
  recorded (it averages exactly 585 frames per episode).
- A detector-methodology section was written and then removed at the author's request.
  It is in git history if wanted; the calibration-drift finding (empty-gripper stop
  1.65 vs 2.33 between sessions) went with it and is a genuine result.
- A LinkedIn projects list was never diffed against the site; LinkedIn blocks automated
  fetching (HTTP 999).
- Three unused files in `assets/media`: `cv/matrix.png`, `peanut/hero.jpg` (both predate
  this work) and `moonranger/lunar-scan.png` (downloaded, never placed). Everything else
  is referenced. The orphan checker above finds them.
