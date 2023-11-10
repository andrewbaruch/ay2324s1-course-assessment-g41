// BE_API contains api endpoints we use to query our host backend
const ROOTS_USER = "/user";
const ROOTS_QUESTION = "/question";
const ROOT_COLLAB = "/collaboration";
const ROOT_MATCHING = "/matching";
const ROOT_DOCUMENT = "/document";
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
  matching: {
    request: `${ROOT_MATCHING}/request`
  },
  collaboration: {
    room: `${ROOT_COLLAB}/room`,
  },
  document: ROOT_DOCUMENT,
  topics: `${ROOTS_USER}/topics`,
  languages: `${ROOTS_USER}/languages`,
  video: {
    signaling: `${ROOTS_VIDEO}/signaling`,
  },
};
