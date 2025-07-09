import { uploadData, type GetUrlWithPathOutput } from 'aws-amplify/storage';
import type { FileUpload } from './type/file.type';
import { getUrl } from 'aws-amplify/storage';

export const uploadFileToS3 = async (
  file: File,
  userId: string,
  onProgress?: (transferredBytes: number, totalBytes?: number) => void
): Promise<FileUpload> => {
    if (!file) {
        throw new Error('No file provided for upload');
    }
    const extension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${extension}`;

    const result = await uploadData({
        path: `public/${userId}/${fileName}`,
        
        // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
        data: file,
        options: { 
            useAccelerateEndpoint: false,
            onProgress: (progress) => {
                if (onProgress) {
                    onProgress(progress.transferredBytes, progress.totalBytes);
                }
            }
        }
    }).result;

    return {
        path: result.path,
        fileName: fileName,
        extension: extension,
        size: result.size,
        contentType: result.contentType,
    };
};

export async function getS3Url(path: string): Promise<GetUrlWithPathOutput> {
    return getUrl({
        path,
        options: {
            validateObjectExistence: false, 
            expiresIn: 600,
            useAccelerateEndpoint: false
        },
    });
}
