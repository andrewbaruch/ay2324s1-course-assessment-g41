// BE_API contains api endpoints we use to query our host backend
export const BE_API = {
  auth: {
    checkAuth: "/auth/checkAuth",
    google: "/auth/google",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    root: "/user",
    topics: "/user/topics",
    user: (id: string) => `/user/${id}`,
    // karwi: remove this
    uploadImageUrl: "/user/uploadImageUrl",
  },
  topics: "/topics",
  languages: "/languages",
};
