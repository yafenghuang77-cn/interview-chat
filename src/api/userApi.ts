import request from '@/utils/request';

export interface LoginParams {
  projectId: number;
  userCode: string;
  verificationCode: string;
}

export interface LoginResult {
  accessToken?: string;
  token?: string;
  [key: string]: unknown;
}

const LOGIN_PATH = '/auth/login';

/** 登录接口不携带已有 token，成功时默认返回响应中的 data。 */
export const login = (params: LoginParams): Promise<LoginResult> => {
  return request<LoginResult>({
    url: LOGIN_PATH,
    method: 'POST',
    data: params,
    withToken: false,
  });
};
