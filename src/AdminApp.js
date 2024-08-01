// src/AdminApp.js
import React, { useState } from 'react';
import PlantAdmin from './PlantAdmin'; // Import the PlantAdmin component

const AdminApp = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
  };

  if (selectedPlant) {
    return <PlantAdmin plant={selectedPlant} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20vh' }}>
      {['Plant A', 'Plant B'].map((plant) => (
        <div
          key={plant}
          onClick={() => handlePlantSelect(plant)}
          style={{
            border: '1px solid #000',
            borderRadius: '8px',
            padding: '20px',
            width: '20%',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <h2>{plant}</h2>
        </div>
      ))}
    </div>
  );
};

export default AdminApp;
