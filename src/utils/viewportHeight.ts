/**
 * 处理视口高度的工具函数
 * 解决移动端浏览器地址栏和 Windows 任务栏遮挡问题
 */

// 设置真实的视口高度
export const setAppHeight = () => {
  // 计算真实的视口高度（减去浏览器UI元素）
  const vh = window.innerHeight * 0.01;
  
  // 设置 CSS 变量
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// 初始化视口高度监听
export const initViewportHeightListener = () => {
  // 初始设置
  setAppHeight();
  
  // 监听窗口大小变化
  window.addEventListener('resize', setAppHeight);
  
  // 监听方向变化（移动设备）
  window.addEventListener('orientationchange', () => {
    setTimeout(setAppHeight, 100); // 延迟以确保正确计算
  });
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', setAppHeight);
    window.removeEventListener('orientationchange', setAppHeight);
  };
};

// 检测是否支持 dvh 单位
export const supportsDvh = () => {
  try {
    const testEl = document.createElement('div');
    testEl.style.height = '100dvh';
    return testEl.style.height === '100dvh';
  } catch {
    return false;
  }
};