function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/login';
const ROOTS_QUESTIONS = '/questions';
const ROOTS_USER = '/user';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
};

export const PATH_PAGE = {
  page404: '/404',
};

export const PATH_QUESTIONS = {
  root: ROOTS_QUESTIONS,
};

export const PATH_USER = {
  root: ROOTS_USER,
  general: {
    user: (userId: string) => path(ROOTS_USER, `/${userId}`),
  },
};
