import { get, post } from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken?: string;
  token?: string;
  userId?: number;
}

export const login = (params: LoginParams): Promise<LoginResult> => {
  return post<LoginResult>({
    url: '/api/auth/login',
    data: params,
    skipToken: true,
  });
};

export interface UserinfoParams {
  userId: string;
}

export interface UserInfo {
  id?: string | number;
  userId?: string | number;
  username?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  [key: string]: unknown;
}

/**
 * 查询当前的用户信息
 * /api/users
 */
export const getCurrentUserInfo = (params?: Partial<UserinfoParams>): Promise<UserInfo> => {
  return get<UserInfo>({
    url: '/api/users',
    data: params,
  });
};
