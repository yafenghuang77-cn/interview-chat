import React, { useState } from 'react';
import { useLoad } from '@tarojs/taro';
import { View, Button, ScrollView } from '@tarojs/components';
import AnchorChat from './components/AnchorChat';
import AnswerAreaList from './components/AnswerAreaList';
import mockData from '../../common/mock';
import './index.less';

console.log(mockData, 'mockData');

const InterviewPage: React.FC = () => {
  const [dataList, setDataList] = useState(mockData);

  useLoad(() => {
    setDataList(mockData);
  });

  const handleSubmit = () => {};

  return (
    <View className="interview">
      <ScrollView className="interview_scroll" scrollY scrollWithAnimation>
        <View className="interview_answerList">
          {dataList.map(item => {
            return (
              <View key={item.id} className="interview__round">
                {item.content && item.content.length > 0 && (
                  <AnchorChat
                    content={item.content}
                    role={item.role}
                    duration={item.duration || null}
                  />
                )}
                {item?.config && Object.keys(item?.config).length > 0 && (
                  <AnswerAreaList options={item.config} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* 底部提交栏 */}
      <View className="interview_footer">
        <Button
          className="interview_submit"
          hoverClass="interview_submit--hover"
          onClick={handleSubmit}
        >
          提交
        </Button>
      </View>
    </View>
  );
};

export default InterviewPage;
