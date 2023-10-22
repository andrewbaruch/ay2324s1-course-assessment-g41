import { AuthProvider } from "src/@types/auth";
import { CacheName } from "src/@types/cache";
import { PATH_AUTH } from "src/routes/paths";
import { checkAuth, loginWithGoogle, logoutWithGoogle } from "@/services/auth";
import { getUser } from "src/services/users";

const isPublicUrl = (url: string) => [PATH_AUTH.general.login].includes(url);
const deleteCache = (name: CacheName) =>
  caches
    .open(name)
    .then((cache) => cache.keys().then((requests) => requests.map((req) => cache.delete(req))));

export const googleAuthProvider: AuthProvider = {
  login: async (params) => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    }
  },
  logout: async () => {
    try {
      await logoutWithGoogle();
      await deleteCache(CacheName.API);
    } catch (err) {
      console.error(err);
    }
  },
  checkError: async (status) => {
    if (status === 401 || status === 403) {
      await logoutWithGoogle();
      throw new Error();
    }
  },
  /**
   * Resolves if session tokens are valid.
   * In case of invalid access token, refreshes it using the current refresh token and resolves.
   * In case of invalid refresh token, throws an error.
   */
  checkAuth: async () => {
    if (isPublicUrl(window.location.hash)) {
      return;
    }

    const response = await checkAuth();

    if (response.status !== 200) {
      throw new Error();
    }
  },
  getIdentity: async () => {
    const response = await getUser();
    const userIdentity = response.data;
    return userIdentity;
  },
};
