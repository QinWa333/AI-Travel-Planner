import { useEffect, useRef } from 'react';
import { message } from 'antd';

export default function MapView({ locations = [], center }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.AMap) {
      message.error('地图加载失败，请检查高德地图 API Key');
      return;
    }

    // 初始化地图
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.AMap.Map(mapRef.current, {
        zoom: 12,
        center: center || [116.397428, 39.90923], // 默认北京
        viewMode: '3D',
      });
    }

    // 清除旧标记
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 添加新标记
    if (locations.length > 0) {
      const bounds = new window.AMap.Bounds();
      
      locations.forEach((location, index) => {
        // 地理编码获取坐标
        const geocoder = new window.AMap.Geocoder();
        geocoder.getLocation(location.address || location.location, (status, result) => {
          if (status === 'complete' && result.geocodes.length) {
            const lnglat = result.geocodes[0].location;
            
            const marker = new window.AMap.Marker({
              position: lnglat,
              title: location.title,
              label: {
                content: `${index + 1}. ${location.title}`,
                direction: 'top'
              }
            });

            marker.setMap(mapInstanceRef.current);
            markersRef.current.push(marker);
            bounds.extend(lnglat);

            // 添加信息窗口
            const infoWindow = new window.AMap.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3>${location.title}</h3>
                  <p>${location.description || ''}</p>
                  <p><strong>时间:</strong> ${location.time || ''}</p>
                  <p><strong>预估费用:</strong> ¥${location.estimated_cost || 0}</p>
                </div>
              `
            });

            marker.on('click', () => {
              infoWindow.open(mapInstanceRef.current, marker.getPosition());
            });
          }
        });
      });

      // 自动调整视野
      setTimeout(() => {
        if (markersRef.current.length > 0) {
          mapInstanceRef.current.setBounds(bounds);
        }
      }, 1000);
    }
  }, [locations, center]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '500px'
      }} 
    />
  );
}
