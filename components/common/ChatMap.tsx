import React from 'react';

// Since we can't import from node_modules, we assume Leaflet is globally available from the <script> tags in index.html.
declare const L: any;

interface ChatMapProps {
  lat: number;
  lng: number;
  title: string;
}

const ChatMap = ({ lat, lng, title }: ChatMapProps) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      L.marker([lat, lng]).addTo(map)
        .bindPopup(title)
        .openPopup();
      mapRef.current = map;
      
      // Invalidate size after a short delay to ensure it renders correctly within the dynamic chat UI
      setTimeout(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
      }, 100);
    }
     // Cleanup function to remove map instance on component unmount
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, [lat, lng, title]);

  return (
    <div ref={mapContainerRef} style={{ height: '200px', width: '100%', borderRadius: '1rem', zIndex: 0 }}></div>
  );
};

export default ChatMap;
