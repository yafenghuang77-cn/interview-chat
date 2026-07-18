import React, { useCallback, useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"account" | "password" | null>(null);

  const handleLogin = useCallback(() => {
    Taro.navigateTo({
      url: "/pages/Home/index",
    });
  }, []);

  return (
    <View className="login-page">
      <View className="login-header">
        <View className="login-logo" />
        <Text className="login-title">百人聊天室访谈系统</Text>
        <Text className="login-subtitle">登录参与访谈</Text>
      </View>

      <View className="login-form">
        <View className="login-field">
          <Text className="login-label">账号</Text>
          <View
            className={`login-input-wrap ${
              focusedField === "account" ? "login-input-wrap--active" : ""
            }`}
          >
            <Input
              className="login-input"
              value={account}
              placeholder="请输入账号"
              placeholderClass="login-placeholder"
              onFocus={() => setFocusedField("account")}
              onBlur={() => setFocusedField(null)}
              onInput={(event) => setAccount(event.detail.value)}
            />
          </View>
        </View>

        <View className="login-field">
          <Text className="login-label">密码</Text>
          <View
            className={`login-input-wrap ${
              focusedField === "password" ? "login-input-wrap--active" : ""
            }`}
          >
            <Input
              className="login-input"
              value={password}
              password
              placeholder="请输入密码"
              placeholderClass="login-placeholder"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onInput={(event) => setPassword(event.detail.value)}
            />
          </View>
        </View>

        <Button className="login-button" onClick={handleLogin}>
          登录
        </Button>
      </View>
    </View>
  );
};

export default LoginPage;
