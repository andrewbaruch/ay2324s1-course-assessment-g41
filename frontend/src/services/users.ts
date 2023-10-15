import authorizedAxios from "src/utils/axios/authorizedAxios";
import { BE_API } from "src/utils/api";
import { UserRequest, UserResponse } from "src/@types/user";

// karwiapi: get user api
export const getUser = () => authorizedAxios.get<UserResponse>(BE_API.user.root);

// karwiapi: patch user api
export const updateUser = (user: UserRequest) =>
  authorizedAxios.patch<UserResponse>(BE_API.user.root, user);
