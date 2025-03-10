import * as multer from "multer"
import * as path from "path"

export function createMulterStorage() {
  return multer.diskStorage({
    destination: `./uploads`,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    },
  })
}
