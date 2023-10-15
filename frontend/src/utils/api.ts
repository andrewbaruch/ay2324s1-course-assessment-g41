// BE_API contains api endpoints we use to query our host backend
export const BE_API = {
  auth: {
    checkAuth: "/user/auth/checkAuth",
    google: "/user/auth/google",
    refresh: "/user/auth/refresh",
    logout: "/user/auth/logout",
  },
  users: {
    root: "/user/user",
    topics: "/user/user/topics",
    user: (id: string) => `/user/${id}`,
    // karwi: remove this
    uploadImageUrl: "/user/user/uploadImageUrl",
  },
  topics: "/user/topics",
  languages: "/user/languages",
};
