// src/types/index.ts
import { Request } from 'express';

export interface Database {
  news: {
    id: number;
    title: string;
    description: string;
    image_data: Buffer;
    image_name: string;
    image_mime: string;
    created_at: Date | null; 
  }
}

export interface NewsInsert {
    id?: number;
    title: string;
    description: string;
    image_data: Buffer;
    image_name: string;
    image_mime: string;
    created_at?: Date | null;
}
  

export interface FileRequest extends Request {
  file?: Express.Multer.File;
}

// News models
export interface NewsInput {
  title: string;
  description: string;
  image_data: Buffer;
  image_name: string;
  image_mime: string;
}

export interface NewsOutput {
  id: number;
  title: string;
  description: string;
  image_data?: Buffer;
  image_name: string;
  image_mime: string;
  created_at: Date;
}