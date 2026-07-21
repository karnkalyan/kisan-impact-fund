# Image replacement guide

## Leadership portraits

Store approved images in `public/images/leadership` and update the exact filename in `app/data.ts`. Use a high-resolution vertical or square photograph with the subject centered. The site applies a consistent 4:4.5 crop while preserving the source file.

## Page photography

The page backgrounds are referenced in `app/globals.css`. Replace them with approved Nepal-specific images using descriptive lowercase filenames. Prefer landscape images at least 1800 pixels wide and compress them for the web. Do not use unrelated logos, artificial board portraits or images that imply unsupported service coverage.

## Alternative text and rights

Describe the subject and context, not the filename. Record photographer/source, license, consent and expiry information outside the public folder. Obtain written permission for portraits and identifiable people.

## Social card

Replace `public/og.png` with a 1200 × 630 PNG. Keep the same filename to avoid code changes, and verify all embedded text at thumbnail size.
