// src/PlantAdmin.js
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
} from '@mui/material';
import PlantForm from './PlantForm'; // Import the PlantForm component

const PlantAdmin = ({ plant }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, `${plant.toLowerCase().replace(' ', '')}HandOvers`));
      const itemsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    };

    fetchItems();
  }, [plant]);

  if (selectedItem) {
    return <PlantForm item={selectedItem} setSelectedItem={setSelectedItem} />;
  }

  return (
    <Container component={Paper} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {plant} Shift Hand Over List
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem button key={item.id} onClick={() => setSelectedItem(item)}>
            <ListItemText primary={`Shift on ${item.date}`} secondary={item.plantName} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PlantAdmin;
