export interface FileUpload {
  fileName: string;
  path: string;
  extension?: string;  
  contentType?: string;
  size?: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}