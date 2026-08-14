/**
 * 生成英语单词发音音频
 * 1. 从 src/data/englishWords.ts 提取全部单词
 * 2. 从有道词典在线发音接口下载 mp3
 * 3. 用 ffmpeg 压缩为低码率 mono 音频，保存到 src/assets/audio/
 * 用法：node scripts/generate-word-audio.js
 * 依赖：ffmpeg（可通过环境变量 FFMPEG_PATH 指定，默认使用 PATH 中的 ffmpeg）
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'englishWords.ts');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'audio');
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const TMP_DIR = path.join(require('os').tmpdir(), 'isea-word-audio');

const YOUDao = (word) => `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(word)}`;
const CONCURRENCY = 4;
const MAX_RETRY = 3;

function extractWords(file) {
  const content = fs.readFileSync(file, 'utf8');
  const words = [];
  const re = /word:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const w = m[1].trim();
    if (!words.includes(w)) words.push(w);
  }
  return words;
}

function sanitize(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

async function download(url, dest, retry = 0) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Referer: 'https://dict.youdao.com/',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error(`too small: ${buf.length}B`);
    fs.writeFileSync(dest, buf);
    return true;
  } catch (e) {
    if (retry < MAX_RETRY) {
      await new Promise((r) => setTimeout(r, 500 * (retry + 1)));
      return download(url, dest, retry + 1);
    }
    console.error(`  [FAIL] download ${url}: ${e.message}`);
    return false;
  }
}

function compress(src, dest) {
  try {
    execFileSync(
      FFMPEG,
      ['-y', '-v', 'error', '-i', src, '-ac', '1', '-ar', '22050', '-codec:a', 'libmp3lame', '-b:a', '32k', dest],
      { stdio: 'pipe' }
    );
    return true;
  } catch (e) {
    console.error(`  [FAIL] ffmpeg ${src}: ${e.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`数据文件不存在: ${DATA_FILE}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const words = extractWords(DATA_FILE);
  console.log(`共 ${words.length} 个单词`);

  let ok = 0;
  let failed = [];
  const queue = [...words];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const word = queue.shift();
      const name = sanitize(word);
      const raw = path.join(TMP_DIR, `${name}.mp3`);
      const out = path.join(OUT_DIR, `${name}.mp3`);
      if (fs.existsSync(out)) {
        ok++;
        continue;
      }
      if (!(await download(YOUDao(word), raw))) {
        failed.push(word);
        continue;
      }
      if (!(await compress(raw, out))) {
        failed.push(word);
        continue;
      }
      ok++;
    }
  });
  await Promise.all(workers);

  console.log(`完成 ${ok}/${words.length}`);
  if (failed.length) {
    console.error(`失败 ${failed.length} 个: ${failed.join(', ')}`);
    process.exitCode = 1;
  } else {
    let total = 0;
    for (const f of fs.readdirSync(OUT_DIR)) total += fs.statSync(path.join(OUT_DIR, f)).size;
    console.log(`音频总大小: ${(total / 1024).toFixed(0)} KB (${(total / 1024 / 1024).toFixed(2)} MB)`);
  }
}

main();
