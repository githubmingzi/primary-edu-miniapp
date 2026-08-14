import React, { useEffect, type ReactNode } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
// 全局样式
import './app.scss';

interface AppProps {
  children: ReactNode;
}

function App(props: AppProps) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onLaunch：全局音频设置，iOS 静音开关下也能正常播放语音
  useEffect(() => {
    try {
      Taro.setInnerAudioOption({
        obeyMuteSwitch: false,
        mixWithOther: true,
        speakerOn: true,
      });
    } catch (e) {
      console.error('设置音频选项失败:', e);
    }
  }, []);

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
