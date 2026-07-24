import React from 'react';
import { Text, View } from '@tarojs/components';
import './AnchorChat.less';

interface AnchorChatProps {
  duration?: string;
  role?: string;
  content?: string;
  className?: string;
}

const AnchorChat: React.FC<AnchorChatProps> = props => {
  const { role = '', content = '', className = '', duration = null } = props;
  return (
    <View className={`AnchorChat ${className}`}>
      <View className="AnchorChat_avatar">
        <Text>{role?.[0]}</Text>
      </View>

      <View className="AnchorChat_message">
        {duration && <Text className="AnchorChat_duration">{duration}</Text>}

        <View className="AnchorChat_card">
          <Text className="AnchorChat_role">{role}</Text>
          <Text className="AnchorChat_content">{content}</Text>
        </View>
      </View>
    </View>
  );
};

export default AnchorChat;
