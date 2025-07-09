import type { AxiosResponse } from "axios";
import { axios } from "./axios-config";
import type { CreateAccount, PageResponse, UserResponse } from "./type/api.type";
import type { FileUpload } from "./type/file.type";


export async function createAccount(request: CreateAccount): Promise<AxiosResponse<CreateAccount & { id: string }>> {
   return axios.post<CreateAccount & { id: string }>("users", request);
}

export async function getMeObject(): Promise<AxiosResponse<UserResponse>> {
   return axios.get<UserResponse>("users/me");
}

export async function uploadFileMetadata(files: FileUpload[]): Promise<AxiosResponse<void>> {
   return axios.post<void>("files", files);
}

export async function getFiles(page: number = 0, limit: number = 20): Promise<AxiosResponse<PageResponse<FileUpload>>> {
   return axios.get<PageResponse<FileUpload>>("files", {
      params: { page, limit },
   });
}

export async function deleteFiles(fileIds: string[]): Promise<AxiosResponse<void>> {
   return axios.delete<void>("files", {
      data: { fileIds },
   });
}