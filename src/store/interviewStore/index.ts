import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import mockData from '@/common/mock';
import type { AnswerConfig } from '@/pages/Interview/components/AnswerAreaList';
import type { CountdownDuration } from '@/pages/Interview/hooks/useCountdown';

export type InterviewItem = {
  id: number;
  role?: string;
  content?: string;
  duration?: CountdownDuration;
  config: AnswerConfig | null;
};

type InterviewState = {
  dataList: InterviewItem[];
};

const initialState: InterviewState = {
  dataList: mockData as InterviewItem[],
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setDataList(state, action: PayloadAction<InterviewItem[]>) {
      state.dataList = action.payload;
    },
    resetDataList(state) {
      state.dataList = initialState.dataList;
    },
  },
});

export const { resetDataList, setDataList } = interviewSlice.actions;
export default interviewSlice.reducer;
