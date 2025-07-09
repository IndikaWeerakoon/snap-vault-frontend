/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';
import { UploadStatus } from "../type/upload-status";
import type { FileUpload } from "../../api/type/file.type";
import type { PageResponse } from "../../api/type/api.type";

export interface FileUploadPreview {
  file: File; 
  preview?: string;
  transferredBytes?: number;
  totalBytes?: number;
}

export interface FileState {
    loading: { [key: string]: boolean };
    error: string | null;
    files?: FileUpload[];
    page?: number;
    limit?: number;
    totalCount?: number;
    uploadStatus: UploadStatus;
    fileUploadPreviews: FileUploadPreview[]; // Previews for files being uploaded
    imageUploadModalOpen?: boolean;
    deletingFileIds?: string[]; // IDs of files being deleted
}

const initialState: FileState = {
    loading: {},
    error: null,
    files: [],
    uploadStatus: UploadStatus.NONE,
    page: 0,
    limit: 20,
    totalCount: 0,
    fileUploadPreviews: [],
    imageUploadModalOpen: false,
    deletingFileIds: []
}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setUploadPreviews: (state, action: PayloadAction<FileUploadPreview[]>) => {
            state.fileUploadPreviews = action.payload;
        },
        setFileUploadPreview: (state, action: PayloadAction<FileUploadPreview>) => {
            const existingIndex = state.fileUploadPreviews?.findIndex(p => p.file.name === action.payload.file.name);
            if (existingIndex !== undefined && existingIndex >= 0) {
                state.fileUploadPreviews[existingIndex] = action.payload;
            } else {
                state.fileUploadPreviews?.push(action.payload);
            }
        },
        setFileUploadPreviewProgress: (state, action: PayloadAction<{ fileName: string; transferredBytes: number; totalBytes?: number }>) => {
            const existingIndex = state.fileUploadPreviews?.findIndex(p => p.file.name === action.payload.fileName);
            if (existingIndex !== undefined && existingIndex >= 0) {
                const preview = state.fileUploadPreviews[existingIndex];
                preview.transferredBytes = action.payload.transferredBytes;
                preview.totalBytes = action.payload.totalBytes ?? preview.totalBytes;
            }
        },
        fileUploadAsync: (state, _action: PayloadAction<FileUploadPreview[]>) => {
            state.loading.imageUploading = true;
            state.uploadStatus = UploadStatus.UPLOADING;
            state.error = null;
        },
        fileUploadStatus: (state, action: PayloadAction<{ error?: string }>) => {
            state.loading.imageUploading = false;
            state.error = action.payload.error ?? null;
            if (action.payload.error) {
                state.uploadStatus = UploadStatus.ERROR;
            } else {
                state.uploadStatus = UploadStatus.SUCCESS;
            }
        },
        fileResetStatus: (state) => {
            state.uploadStatus = UploadStatus.NONE;
            state.fileUploadPreviews = [];
            state.error = null;
        },
        uploadFileMetadataAsync(state, _action: PayloadAction<{ files: FileUpload[] }>) {
            state.loading.imageUploading = true;
            state.error = null;
        },
        uploadFileMetadataStatus(state, action: PayloadAction<{ error?: string }>) {
            state.loading.imageUploading = false;
            state.error = action.payload.error ?? null;
            if (action.payload.error) {
                state.uploadStatus = UploadStatus.ERROR;
            } else {
                state.uploadStatus = UploadStatus.SUCCESS;
            }
        },
        getImagesAsync(state, _action: PayloadAction<{ page?: number; limit?: number, insertFirst?: boolean }>) {
            state.loading.images = true;
            state.error = null;
        },
        getImagesStatus(state, action: PayloadAction<Partial<PageResponse<FileUpload>> & { error?: string, insertFirst?: boolean }>) {
            state.loading.images = false;
            state.limit = action.payload.limit ?? 20;
            state.totalCount = action.payload.totalCount ?? 0;
            state.error = action.payload.error ?? null;

            let files = state.files;
            if (action.payload.insertFirst) {
                files?.unshift(...(action.payload.items ?? []));
            } else {
                files?.push(...action.payload.items ?? []);
            }
            
            files = files?.filter((file, index, self) =>
                index === self.findIndex((f) => f.id === file.id))
            state.files = files;
            
            if (!action.payload.error && action.payload.items?.length) {
                state.page = (action.payload?.page ?? 0) + 1;
            }
        },
        toggleFileUploadModal: (state, action: PayloadAction<boolean>) => {
            state.imageUploadModalOpen = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        deleteFileAsync: (state, action: PayloadAction<FileUpload[]>) => {
            state.loading.deleteFile = true;
            state.error = null;
            const fileIds = action.payload.map(file => file.id ?? '');
            state.deletingFileIds = [...(state.deletingFileIds ?? []), ...fileIds];
        },
        deleteFilesStatus: (state, action: PayloadAction<{ fileIds?: string[], error?: string, }>) => {
            console.log('deleteFilesStatus', action.payload);
            state.loading.deleteFile = false;
            state.error = action.payload.error ?? null;
            const fileIds = action.payload.fileIds ?? [];
            if (fileIds.length > 0 && !action.payload.error) {
                state.files = state.files?.filter(file => !fileIds?.includes(file.id ?? ''));
                state.deletingFileIds = state.deletingFileIds?.filter(id => !fileIds.includes(id));
            }
        }
            
    }
});

export const { 
    setUploadPreviews,
    setFileUploadPreview,
    setFileUploadPreviewProgress,
    fileUploadAsync, 
    fileUploadStatus,
    fileResetStatus,
    uploadFileMetadataStatus,
    uploadFileMetadataAsync,
    getImagesAsync,
    getImagesStatus,
    toggleFileUploadModal,
    clearErrors,
    deleteFileAsync,
    deleteFilesStatus
} = fileSlice.actions;

const counterPersistConfig = {
    key: 'file',
    storage,
    whitelist: [], 
  };

export default persistReducer(counterPersistConfig, fileSlice.reducer);
