import request from '../../utils/request';
import { LoginParams, LoginResult, getSessionStatusParams } from './type';

const BASEAPI = '/research.kfc.common.v2';

/**
 *登录接口
 */
export const login = (params: LoginParams): Promise<LoginResult> => {
  return request<LoginResult>({
    method: 'POST',
    url: `${BASEAPI}/hp/chat/login`,
    data: params,
    withToken: false,
  });
};

/**
 *短轮询会话状态
 */

export const getSessionStatus = (params: getSessionStatusParams) => {
  const { followupCursor = 0, currentQuestionId } = params;

  const questionIdQuery =
    currentQuestionId && currentQuestionId?.trim()
      ? `&currentQuestionId=${encodeURIComponent(currentQuestionId?.trim())}`
      : '';

  return request({
    method: 'POST',
    url: `${BASEAPI}/hp/chat/session/status?followupCursor=${Math.max(0, followupCursor)}${questionIdQuery}`,
  });
};
