// 动态加载高德地图 API
let isLoading = false;
let isLoaded = false;

export function loadAMap() {
  return new Promise((resolve, reject) => {
    // 如果已经加载，直接返回
    if (window.AMap) {
      isLoaded = true;
      resolve(window.AMap);
      return;
    }

    // 如果正在加载，等待加载完成
    if (isLoading) {
      const checkInterval = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkInterval);
          resolve(window.AMap);
        }
      }, 100);
      return;
    }

    isLoading = true;

    // 从环境变量获取 Key，如果没有则使用默认值
    const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '032965e2b15bf5374adcd1d015346952';

    // 创建 script 标签
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    
    script.onload = () => {
      isLoading = false;
      isLoaded = true;
      resolve(window.AMap);
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('高德地图 API 加载失败'));
    };

    document.head.appendChild(script);
  });
}
