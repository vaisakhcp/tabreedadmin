// src/PlantForm.js
import React from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';

const PlantForm = ({ item, setSelectedItem }) => {
  const {
    plantName,
    date,
    time,
    shift,
    equipmentStatus,
    activities,
    equipmentNotAvailable,
    operatorName,
    operatorDate,
    operatorSignature,
    supervisorName,
    supervisorDate,
    supervisorSignature,
  } = item;

  return (
    <Container component={Paper} sx={{ p: 3, mt: 3 }}>
      <Button onClick={() => setSelectedItem(null)} variant="contained" sx={{ mb: 3 }}>
        Back to List
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Shift Hand Over Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField label="Plant Name" value={plantName} fullWidth disabled />
        <TextField label="Date" value={date} fullWidth disabled />
        <TextField label="Time" value={time} fullWidth disabled />
        <TextField label="Shift" value={shift} fullWidth disabled />
      </Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Plant Status
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Equipment List</TableCell>
            <TableCell>Plant Actual Parameters</TableCell>
            <TableCell>Status / Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipmentStatus.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.equipment}</TableCell>
              <TableCell>{item.parameters}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" component="h2" gutterBottom>
        Activities
      </Typography>
      {activities.map((activity, index) => (
        <TextField
          key={index}
          fullWidth
          value={activity}
          disabled
          sx={{ mb: 2 }}
        />
      ))}
      <Typography variant="h6" component="h2" gutterBottom>
        Equipment Not Available
      </Typography>
      {equipmentNotAvailable.map((equipment, index) => (
        <TextField
          key={index}
          fullWidth
          value={equipment}
          disabled
          sx={{ mb: 2 }}
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <TextField
            label="Operator Name"
            value={operatorName}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Operator Date"
            type="date"
            value={operatorDate}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          {operatorSignature && (
            <img
              src={operatorSignature}
              alt="Operator Signature"
              style={{ display: 'block', margin: '10px auto', border: '1px solid #000', width: '200px', height: '100px' }}
            />
          )}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <TextField
            label="Supervisor Name"
            value={supervisorName}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Supervisor Date"
            type="date"
            value={supervisorDate}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          {supervisorSignature && (
            <img
              src={supervisorSignature}
              alt="Operator Signature"
              style={{ display: 'block', margin: '10px auto', border: '1px solid #000', width: '200px', height: '100px' }}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PlantForm;
