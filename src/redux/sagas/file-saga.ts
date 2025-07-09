import { all, call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { deleteFileAsync, deleteFilesStatus, fileUploadAsync, fileUploadStatus, getImagesAsync, getImagesStatus, setFileUploadPreview, uploadFileMetadataAsync, type FileUploadPreview } from "../slices/file-slice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getS3Url, uploadFileToS3 } from "../../api/s3-api";
import type { RootState } from "../store";
import type { FileUpload } from "../../api/type/file.type";
import { deleteFiles, getFiles, uploadFileMetadata } from "../../api/backend-api";
import type { PageResponse } from "../../api/type/api.type";
import type { AxiosResponse } from "axios";
import type { GetUrlWithPathOutput } from "aws-amplify/storage";
import { store } from "../store";

function* watchFileUpload({ payload }: PayloadAction<FileUploadPreview[]>) {
    try {
        const userId: string = yield select((state: RootState) => state.auth.user?.id);
        if (!userId) {
            throw new Error('User ID not found in state');
        }
        const fileUploads = payload.map(file => {
            const fileUploadProgress = (transferredBytes: number, totalBytes?: number) => {
                updateFileProgress(file, transferredBytes, totalBytes);
            };
            return call(uploadFileToS3, file.file, userId, fileUploadProgress);
        })

        const response: FileUpload[] = yield all(fileUploads);
        yield put(uploadFileMetadataAsync({ files: response }));

        yield put(fileUploadStatus({ error: undefined }));
        
    } catch (error) {
        console.error('File upload failed:', error);
        yield put(fileUploadStatus({ error: (error as Error).message }));
    }
}

function updateFileProgress(file: FileUploadPreview, transferredBytes: number, totalBytes?: number) {
    const fileProgress: FileUploadPreview = {
        file: file.file,
        preview: file.preview,
        transferredBytes,
        totalBytes
    }
    store.dispatch(setFileUploadPreview(fileProgress));
}

function* watchFileUploadMetadata({ payload }: PayloadAction<{ files: FileUpload[] }>) {
    try {
        yield call(uploadFileMetadata, payload.files);
        yield put(fileUploadStatus({ error: undefined }));
        yield put(getImagesAsync({ page: 0, limit: payload.files.length, insertFirst: true }));
    } catch (error) {
        console.error('File metadata upload failed:', error);
        yield put(fileUploadStatus({ error: (error as Error).message }));
    }   
}

function* watchGetImages({ payload }: PayloadAction<{ page?: number; limit?: number, insertFirst?: boolean }>) {
    try {
        const imageResponse: AxiosResponse<PageResponse<FileUpload>> = yield call(getFiles, payload.page, payload.limit);
        const filesPaths = imageResponse.data.items.map(file => file.path);
        const fileS3PathFetch = filesPaths.map(path => call(getS3Url, path));

        const s3FilePaths:GetUrlWithPathOutput[]  = yield all(fileS3PathFetch);
        imageResponse.data.items = imageResponse.data.items.map((item, index) => ({
            ...item,
            path: s3FilePaths[index].url.toString(),
        }));
        yield put(getImagesStatus({...imageResponse.data, insertFirst: payload.insertFirst }));
        
    } catch (error) {
        console.error('Failed to get files:', error);
        yield put(getImagesStatus({ error: (error as Error).message }));
    }
}

function* watchDeleteFiles({ payload }: PayloadAction<FileUpload[]>) {
    try {
        const fileIds = payload.map(file => file.id!).filter(id => id !== undefined);
        if (fileIds.length === 0) {
            throw new Error('No valid file IDs provided for deletion');
        }
        yield call(deleteFiles, fileIds);
        yield put(deleteFilesStatus({ fileIds, error: undefined }));
    } catch (error) {
        console.error('File deletion failed:', error);
        yield put(deleteFilesStatus({ error: (error as Error).message }));
    }
}

export default function* fileSaga() {
    yield takeLatest(fileUploadAsync, watchFileUpload) 
    yield takeLatest(uploadFileMetadataAsync, watchFileUploadMetadata); 
    yield takeLatest(getImagesAsync, watchGetImages);
    yield takeEvery(deleteFileAsync, watchDeleteFiles);
}