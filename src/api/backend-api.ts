import type { AxiosResponse } from "axios";
import { axios } from "./axios-config";
import type { CreateAccount, UserResponse } from "./type/api.type";


export async function createAccount(request: CreateAccount): Promise<AxiosResponse<CreateAccount & { id: string }>> {
   return axios.post<CreateAccount & { id: string }>("users", request);
}

export async function getMeObject(): Promise<AxiosResponse<UserResponse>> {
   return axios.get<UserResponse>("users/me");
}