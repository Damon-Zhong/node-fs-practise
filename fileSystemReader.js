const fs = require("fs");
const path = require("path");
const rootDir = "./myfiles";

class File {
  constructor(filename, name, ext, isFile, createTime, updateTime) {
    this.filename = filename;
    this.name = name;
    this.ext = ext;
    this.isFile = isFile;
    this.createTime = createTime;
    this.updateTime = updateTime;
  }

  static async createFile(filename) {
    const stat = await fs.promises.stat(filename);
    const name = path.basename(filename);
    const ext = path.extname(filename);
    const isFile = stat.isFile();
    const size = stat.size;
    const createTime = new Date(stat.birthtimeMs).toDateString();
    const updateTime = new Date(stat.mtimeMs).toDateString();

    return new File(filename, name, ext, isFile, size, createTime, updateTime);
  }

  async getChildren() {
    if (this.isFile) {
      return [];
    }

    const children = await fs.promises.readdir(this.filename);

    return Promise.all(
      children.map((child) => {
        const childPath = path.resolve(this.filename, child);
        return File.createFile(childPath);
      })
    );
  }

  async getContent(isBuffer = false) {
    if (this.isFile) {
      if (isBuffer) {
        return await fs.promises.readFile(this.filename);
      }

      return await fs.promises.readFile(this.filename, "utf-8");
    }

    return null;
  }
}

async function classReadDir(dirname){
  const file = await File.createFile(dirname)
  return await file.getChildren()
}

async function classFileSystemReader(){
  const dirname = path.resolve(__dirname, rootDir)
  const result = await classReadDir(dirname);
  console.log(result)
}

classFileSystemReader()
    

// async function readDir(dirname) {
//   // 1. 解析完整路径
//   // 2. 读取路径下所有文件、目录
//   // 3. 循环所有文件和目录，若为文件则创建文件对象并加入数组
//   const dirPath = dirname ?? path.resolve(__dirname, rootDir);
//   const files = await fs.promises.readdir(dirPath);
//   const result = [];

//   for (const file of files) {
//     const filePath = path.resolve(dirPath, "./", file);
//     const fileStat = await fs.promises.stat(filePath);
//     const { ext } = path.parse(filePath);

//     if (fileStat.isFile()) {
//       result.push({
//         name: file,
//         ext,
//         isFile: fileStat.isFile(),
//         size: fileStat.size,
//         createTime: new Date(fileStat.birthtimeMs).toDateString(),
//         updateTime: new Date(fileStat.mtimeMs).toDateString(),
//         getChildren: async () => {
//           return await Promise.resolve([]);
//         },
//         getContent: async (isBuffer = false) => {
//           return await fs.promises.readFile(filePath, "utf-8");
//         },
//       });
//     } else {
//       result.push({
//         name: file,
//         ext: "",
//         isFile: fileStat.isFile(),
//         size: fileStat.size,
//         createTime: new Date(fileStat.birthtimeMs).toDateString(),
//         updateTime: new Date(fileStat.mtimeMs).toDateString(),
//         getChildren: async () => {
//           return await readDir(filePath);
//         },
//         getContent: async (isBuffer = false) => {
//           return await Promise.resolve(null);
//         },
//       });
//     }
//   }

//   return result;
// }

// async function readFileSystem() {
//   try {
//     const result = await readDir();
//     const content1 = await result[0].getContent();
//     console.log(content1);
//   } catch (err) {
//     console.error(err);
//   }
//   /**
//    * 文件对象结构
//    * {
//    * name: 文件夹/文件名,
//    * ext：后缀名,
//    * isFile: 是否是文件
//    * size: 文件大小
//    * createTime: 日期对象，创建时间,
//    * updateTime: 日期对象，修改时间,
//    * getChildren(): 得到目录下子文件对象数组，如果是文件，返回空数组
//    * getContent(isBuffer = false): 获取文件内容，如果是目录，返回null }
//    */
// }

// readFileSystem();
