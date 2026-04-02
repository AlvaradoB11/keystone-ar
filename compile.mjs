import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';
import { CompilerBase } from './node_modules/mind-ar/src/image-target/compiler-base.js';
import './node_modules/mind-ar/src/image-target/detector/kernels/cpu/index.js';

class NodeCompiler extends CompilerBase {
  createProcessCanvas(img) {
    return createCanvas(img.width, img.height);
  }

  compileTrack({ progressCallback, targetImages, basePercent }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { buildTrackingImageList } = await import('./node_modules/mind-ar/src/image-target/image-list.js');
        const { extractTrackingFeatures } = await import('./node_modules/mind-ar/src/image-target/tracker/extract-utils.js');

        const percentPerImage = (100 - basePercent) / targetImages.length;
        let percent = 0;
        const list = [];
        for (let i = 0; i < targetImages.length; i++) {
          const targetImage = targetImages[i];
          const imageList = buildTrackingImageList(targetImage);
          const percentPerAction = percentPerImage / imageList.length;
          const trackingData = extractTrackingFeatures(imageList, () => {
            percent += percentPerAction;
            progressCallback(basePercent + percent);
          });
          list.push(trackingData);
        }
        resolve(list);
      } catch (e) {
        reject(e);
      }
    });
  }
}

const imagePaths = [
  'assets/target-1.jpg',
  'assets/target-2.jpg',
  'assets/target-3.jpg',
  'assets/target-4.jpg',
  'assets/target-5.jpg',
  'assets/target-6.jpg',
  'assets/target-7.jpg',
  'assets/target-8.jpg',
  'assets/target-9.jpg',
];

async function main() {
  console.log('Loading images...');
  const images = await Promise.all(imagePaths.map(p => loadImage(p)));
  console.log(`Loaded ${images.length} images.`);

  const compiler = new NodeCompiler();

  console.log('Compiling targets (this may take several minutes)...');
  await compiler.compileImageTargets(images, (progress) => {
    process.stdout.write(`\rProgress: ${progress.toFixed(1)}%   `);
  });

  const buffer = compiler.exportData();
  writeFileSync('targets.mind', Buffer.from(buffer));
  console.log('\nDone! targets.mind written.');
}

main().catch(err => { console.error(err); process.exit(1); });
