import { useEffect, useRef } from 'react';

export default function MapView({ locations = [], center, city }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.AMap || !mapRef.current) {
      return;
    }

    // 国内热门城市坐标库
    const cityCenters = {
      // 直辖市
      '北京': [116.4074, 39.9042],
      '上海': [121.4737, 31.2304],
      '天津': [117.2008, 39.0842],
      '重庆': [106.5516, 29.5630],

      // 省会及重点城市
      '广州': [113.2644, 23.1291],
      '深圳': [114.0579, 22.5431],
      '成都': [104.0668, 30.5728],
      '杭州': [120.1551, 30.2741],
      '武汉': [114.3055, 30.5931],
      '西安': [108.9398, 34.3416],
      '南京': [118.7969, 32.0603],
      '郑州': [113.6254, 34.7466],
      '长沙': [112.9388, 28.2282],
      '沈阳': [123.4328, 41.8045],
      '青岛': [120.3826, 36.0671],
      '济南': [117.1205, 36.6519],
      '哈尔滨': [126.5349, 45.8038],
      '长春': [125.3235, 43.8171],
      '大连': [121.6147, 38.9140],
      '昆明': [102.8329, 24.8801],
      '厦门': [118.0894, 24.4798],
      '福州': [119.2965, 26.0745],
      '南昌': [115.8581, 28.6832],
      '合肥': [117.2272, 31.8206],
      '石家庄': [114.5149, 38.0428],
      '太原': [112.5489, 37.8706],
      '南宁': [108.3661, 22.8172],
      '贵阳': [106.7135, 26.5783],
      '兰州': [103.8343, 36.0611],
      '西宁': [101.7782, 36.6171],
      '银川': [106.2586, 38.4680],
      '乌鲁木齐': [87.6168, 43.8256],
      '拉萨': [91.1145, 29.6447],
      '呼和浩特': [111.6708, 40.8183],
      '海口': [110.3312, 20.0311],
      '三亚': [109.5082, 18.2528],

      // 热门旅游城市
      '苏州': [120.5954, 31.2989],
      '无锡': [120.3019, 31.5747],
      '宁波': [121.5440, 29.8683],
      '桂林': [110.2993, 25.2736],
      '张家界': [110.4790, 29.1274],
      '丽江': [100.2330, 26.8721],
      '大理': [100.2251, 25.5969],
      '黄山': [118.3377, 29.7146],
      '九寨沟': [103.9174, 33.2600],
      '峨眉山': [103.4844, 29.6016],
      '泰山': [117.1009, 36.2545],
      '庐山': [115.9882, 29.5916],
      '珠海': [113.5765, 22.2707],
      '佛山': [113.1220, 23.0218],
      '东莞': [113.7518, 23.0209],
      '中山': [113.3927, 22.5170],
      '惠州': [114.4152, 23.1115],
      '扬州': [119.4129, 32.3912],
      '镇江': [119.4252, 32.2044],
      '常州': [119.9740, 31.8109],
      '徐州': [117.2838, 34.2053],
      '南通': [120.8945, 32.0146],
      '温州': [120.6994, 27.9937],
      '金华': [119.6494, 29.0789],
      '绍兴': [120.5820, 30.0291],
      '嘉兴': [120.7555, 30.7463],
      '湖州': [120.0867, 30.8941],
      '台州': [121.4287, 28.6614],
      '洛阳': [112.4540, 34.6197],
      '开封': [114.3477, 34.7972],
      '秦皇岛': [119.6004, 39.9354],
      '承德': [117.9634, 40.9517],
      '保定': [115.4648, 38.8740],
      '唐山': [118.1802, 39.6304],
      '烟台': [121.4478, 37.4638],
      '威海': [122.1206, 37.5097],
      '潍坊': [119.1619, 36.7067],
      '淄博': [118.0548, 36.8131],
    };

    // 根据行程自动确定中心点和地区
    let defaultCenter = [116.4074, 39.9042]; // 默认北京
    let isOverseas = false;

    // 优先使用传入的 city 参数
    if (city) {
      console.log('使用行程城市字段:', city);
      // 检查是否是海外城市
      if (city.includes('东京') || city.includes('日本') ||
        city.includes('大阪') || city.includes('京都') ||
        city.includes('韩国') || city.includes('首尔') ||
        city.includes('泰国') || city.includes('曼谷')) {
        isOverseas = true;
      } else {
        // 匹配国内城市 - 按城市名长度排序，优先匹配长名称
        const sortedCities = Object.entries(cityCenters).sort((a, b) => b[0].length - a[0].length);
        for (const [cityName, coords] of sortedCities) {
          if (city.includes(cityName)) {
            defaultCenter = coords;
            console.log('匹配到城市:', cityName, coords);
            break;
          }
        }
      }
    } else if (locations.length > 0) {
      // 如果没有 city 字段，尝试从所有地点中提取城市
      console.log('没有 city 字段，从地点列表提取城市');

      // 遍历所有地点，尝试匹配城市
      let matched = false;
      for (const location of locations) {
        const locationText = (location.location || '') + ' ' + (location.title || '') + ' ' + (location.description || '');

        // 检查是否是海外
        if (locationText.includes('东京') || locationText.includes('日本') ||
          locationText.includes('大阪') || locationText.includes('京都') ||
          locationText.includes('韩国') || locationText.includes('首尔') ||
          locationText.includes('泰国') || locationText.includes('曼谷')) {
          isOverseas = true;
          matched = true;
          break;
        }

        // 匹配国内城市 - 按城市名长度排序，优先匹配长名称
        const sortedCities = Object.entries(cityCenters).sort((a, b) => b[0].length - a[0].length);
        for (const [cityName, coords] of sortedCities) {
          if (locationText.includes(cityName)) {
            defaultCenter = coords;
            matched = true;
            console.log('从地点匹配到城市:', cityName, coords, '地点:', locationText.substring(0, 50));
            break;
          }
        }

        if (matched) break;
      }

      if (!matched) {
        console.log('未匹配到城市，使用默认:', defaultCenter);
      }
    }

    // 如果是海外行程，不创建地图
    if (isOverseas) {
      return;
    }

    // 只创建一次地图
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.AMap.Map(mapRef.current, {
        zoom: 12,
        center: center || defaultCenter,
        viewMode: '2D',
      });
    } else {
      // 如果地图已存在，更新中心点
      mapInstanceRef.current.setCenter(center || defaultCenter);
      mapInstanceRef.current.setZoom(12);
    }
  }, [locations, center, city]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          // 忽略销毁错误
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 检查是否是海外行程
  const isOverseas = locations.length > 0 && locations.some(loc => {
    const locationName = loc.location || loc.title || '';
    return locationName.includes('日本') || locationName.includes('东京') ||
      locationName.includes('大阪') || locationName.includes('京都') ||
      locationName.includes('韩国') || locationName.includes('首尔') ||
      locationName.includes('泰国') || locationName.includes('曼谷');
  });

  if (!window.AMap) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#999' }}>
        <h3>地图功能未配置</h3>
        <p>请在 index.html 中配置高德地图 API Key</p>
      </div>
    );
  }

  if (isOverseas) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '100px 50px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        color: 'white'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
        <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>海外行程</h3>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          高德地图主要支持中国境内地图显示
        </p>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
          您的行程包含海外目的地，建议使用 Google Maps 或其他国际地图服务查看路线
        </p>
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <p style={{ margin: '5px 0' }}>📍 行程地点数: {locations.length}</p>
          <p style={{ margin: '5px 0' }}>🌏 目的地: {locations[0]?.location || '海外'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
}
