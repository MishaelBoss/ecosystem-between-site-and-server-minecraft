import React from 'react';

export default function MapPage() {
  const dynmapUrl = process.env.NEXT_PUBLIC_DYNMAP_URL || "http://c5.play2go.cloud:20167/";

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 64px)', // Adjust height minus the header
      display: 'flex',
      flexDirection: 'column'
    }}>
      <iframe 
        src={dynmapUrl} 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Minecraft Server Map"
        allowFullScreen
      />
    </div>
  );
}
