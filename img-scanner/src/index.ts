import * as path from "path";
import * as fs from "fs";
import sizeOf from "image-size";
import { promisify } from "util";

const imgFolder = path.join(process.cwd(), "dist", "img");
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const sizeOfAsync = promisify(sizeOf);

async function readImages() {
  try {
    const files = await readdirAsync(imgFolder);

    for (const file of files) {
      const filePath = path.join(imgFolder, file);
      const stats = await statAsync(filePath);
      const dimensions = await sizeOfAsync(filePath);

      const sizeInMB = stats.size / (1024 * 1024);
      console.log(
        `${file} 尺寸: ${dimensions.width}x${
          dimensions.height
        }, 大小: ${sizeInMB.toFixed(2)} MB`
      );
    }
  } catch (err) {
    console.error("处理图片时出错: ", err);
  }
}

readImages();
