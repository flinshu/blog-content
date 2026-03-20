import sharp from "sharp";
import { stat, mkdir } from "fs/promises";
import { dirname, extname } from "path";
import { execSync } from "child_process";

const MAX_WIDTH = 1920;

// Get staged image files
function getStagedImages() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf-8",
  });
  return output
    .split("\n")
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .filter(f => f.includes("/assets/"));
}

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const tmpPath = filePath + ".tmp";

  let pipeline = sharp(filePath);
  const metadata = await pipeline.metadata();

  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
      break;
    case ".png":
      pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
      break;
    case ".webp":
      pipeline = pipeline.webp({ quality: 85 });
      break;
  }

  await pipeline.toFile(tmpPath);

  const [srcStat, dstStat] = await Promise.all([
    stat(filePath),
    stat(tmpPath),
  ]);

  // Only replace if actually smaller
  if (dstStat.size < srcStat.size) {
    const { rename } = await import("fs/promises");
    await rename(tmpPath, filePath);
    const saved = ((1 - dstStat.size / srcStat.size) * 100).toFixed(1);
    console.log(
      `  ${filePath}: ${(srcStat.size / 1024).toFixed(0)}KB → ${(dstStat.size / 1024).toFixed(0)}KB (${saved}% saved)`
    );
    // Re-stage the compressed file
    execSync(`git add "${filePath}"`);
  } else {
    const { unlink } = await import("fs/promises");
    await unlink(tmpPath);
    console.log(`  ${filePath}: already optimized, skipped`);
  }
}

async function main() {
  const images = getStagedImages();

  if (images.length === 0) {
    process.exit(0);
  }

  console.log(`Compressing ${images.length} image(s)...`);

  for (const img of images) {
    await compressImage(img);
  }

  console.log("Done!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
