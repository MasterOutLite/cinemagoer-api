import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { v2 as cloudinary } from "cloudinary";


export enum TypeFile {
  AVATAR = "avatar",
  VIDEO = "video",
  TRAILER = "trailer",
  PICTURES = "pictures"
}

@Injectable()
export class FilesService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });

    console.log("Init cloudinary:", {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }

  async createFile(type: TypeFile, file: Express.Multer.File): Promise<string> {
    return await this.saveOnCloud(type, file);
  }

  async createFileSeed(type: TypeFile, name: string) {
    try {
      //read
      const filePathToFile = path.resolve(__dirname, "..", "..", "seed-obg", type, name);
      console.log("createFileSimple:", name);
      const file = fs.readFileSync(filePathToFile);

      // Завантаження файлу на Cloudinary
      const dataURI = `data:text/plain;base64,${file.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: type });
      // Виведення URL завантаженого файлу

      console.log("Uploaded file URL:", result.secure_url);
      return result.secure_url;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  removeFile(name: string): boolean {
    return;
  }

  async saveOnCloud(type: TypeFile, file: Express.Multer.File) {
    try {
      // Завантаження файлу на Cloudinary
      const imageAsBase64 = file.buffer.toString("base64");
      const dataURI = `data:text/plain;base64,${imageAsBase64}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: type });
      // Виведення URL завантаженого файлу
      console.log("Uploaded file URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveOnStorage(type: TypeFile, file: Express.Multer.File) {
    try {
      //For release
      //const filePath = path.resolve(__dirname, '..', 'static', type);
      //For development
      const filePath = path.resolve(__dirname, "..", "..", "static", type);
      const fileName = uuid.v4() + "." + file.originalname.split(".").pop();
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return type + "/" + fileName;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

}
