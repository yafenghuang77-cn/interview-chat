import React from 'react';
import { Text, View } from '@tarojs/components';
import { useCountdown, type CountdownDuration } from '../hooks/useCountdown';
import { useTypingText } from '../hooks/useTypingText';
import './AnchorChat.less';

interface AnchorChatProps {
  duration?: CountdownDuration | null;
  role?: string;
  content?: string;
  className?: string;
}

const AnchorChat: React.FC<AnchorChatProps> = props => {
  const { role = '', content = '', className = '', duration } = props;
  const countdown = useCountdown(duration);
  const typingContent = useTypingText(content);

  return (
    <View className={`AnchorChat ${className}`}>
      <View className="AnchorChat_avatar">
        <Text>{role?.[0]}</Text>
      </View>

      <View className="AnchorChat_message">
        {countdown && <Text className="AnchorChat_duration">{countdown}</Text>}

        <View className="AnchorChat_card">
          <Text className="AnchorChat_role">{role}</Text>
          <Text className="AnchorChat_content">{typingContent}</Text>
        </View>
      </View>
    </View>
  );
};

export default AnchorChat;
