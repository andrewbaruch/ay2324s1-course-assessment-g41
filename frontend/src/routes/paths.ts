function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_ADMIN = '/admin';
const ROOTS_USER = '/user';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  general: {
    login: path(ROOTS_AUTH, '/sign-in'),
  },
};

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  general: {
    dashboard: path(ROOTS_ADMIN, '/dashboard'),
    questions: path(ROOTS_ADMIN, '/questions'),
    profile: path(ROOTS_ADMIN, '/profile'),
  },
};

export const PATH_PAGE = {
  page404: '/404',
};

export const PATH_USER = {
  root: ROOTS_USER,
  general: {
    user: (userId: string) => path(ROOTS_USER, `/${userId}`),
  },
};
