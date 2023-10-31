// BE_API contains api endpoints we use to query our host backend
const ROOTS_USER = "/user";
const ROOT_QUESTION = "/question";
const ROOT_COLLAB = "/collaboration";
const ROOT_MATCHING = "/matching";

export const BE_API = {
  auth: {
    checkAuth: `${ROOTS_USER}/auth/checkAuth`,
    google: `${ROOTS_USER}/auth/google`,
    refresh: `${ROOTS_USER}/auth/refresh`,
    logout: `${ROOTS_USER}/auth/logout`,
  },
  users: {
    root: `${ROOTS_USER}/user`,
    topics: `${ROOTS_USER}/user/topics`,
    user: (id: string) => `${ROOTS_USER}/user/${id}`,
    // karwi: remove this
    uploadImageUrl: `${ROOTS_USER}/user/uploadImageUrl`,
  },
  questions: {
    root: `${ROOT_QUESTION}/question`,
  },
  matching: {
    request: `${ROOT_MATCHING}/request`
  },
  collaboration: {
    broadcast: `${ROOT_COLLAB}/broadcast`,
    room: `${ROOT_COLLAB}/room`,
  },
  topics: `${ROOTS_USER}/topics`,
  languages: `${ROOTS_USER}/languages`,
};
