// BE_API contains api endpoints we use to query our host backend
const ROOTS_USER = "/user";
const ROOTS_QUESTION = "/question";
const ROOTS_COLLAB = "/collaboration";
const ROOTS_VIDEO = "/videostreaming";

// karwi: refactor groups. each shd be microservice
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
    root: `${ROOTS_QUESTION}/question`,
  },
  collaboration: {
    broadcast: `${ROOTS_COLLAB}/broadcast`,
    room: `${ROOTS_COLLAB}/room`,
  },
  topics: `${ROOTS_USER}/topics`,
  languages: `${ROOTS_USER}/languages`,
  video: {
    signaling: `${ROOTS_VIDEO}/signaling`,
  },
};
