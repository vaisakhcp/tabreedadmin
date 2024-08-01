// import React, { useEffect, useState } from 'react';
// import { db } from './firebaseConfig';
// import { collection, getDocs } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Button,
//   useMediaQuery,
// } from '@mui/material';

// const AdminPanel = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const isMobile = useMediaQuery('(max-width:600px)');

//   useEffect(() => {
//     const fetchData = async () => {
//       const querySnapshot = await getDocs(collection(db, 'shiftHandOvers'));
//       const data = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setSubmissions(data);
//     };
//     fetchData();
//   }, []);

//   const handleLogin = () => {
//     if (username === 'mnoushad@tabreed.ae' && password === '#Admin%Tabreed*') {
//       setLoggedIn(true);
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   const renderSubmissions = (plantName) => {
//     return submissions
//       .filter(submission => submission.plantName === plantName)
//       .map(submission => (
//         <ListItem key={submission.id} button component={Link} to={`/admin/${submission.id}`}>
//           <ListItemText primary={`${submission.plantName} - ${submission.date}`} />
//         </ListItem>
//       ));
//   };

//   return (
//     <Container component={Paper} sx={{ p: 3, mt: 3 }}>
//       {!loggedIn ? (
//         <Box sx={{ maxWidth: 400, mx: 'auto' }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Admin Login
//           </Typography>
//           <TextField
//             label="Username"
//             fullWidth
//             sx={{ mb: 2 }}
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <TextField
//             label="Password"
//             type="password"
//             fullWidth
//             sx={{ mb: 2 }}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button variant="contained" color="primary" onClick={handleLogin}>
//             Login
//           </Button>
//         </Box>
//       ) : (
//         <>
//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//             <img src={require('./logo.png')} alt="Logo" style={{ height: '50px', margin: 20 }} />
//           </Box>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Admin Panel - Submissions
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h5" component="h2" gutterBottom>
//                 DM-006
//               </Typography>
//               <Paper sx={{ p: 2 }}>
//                 <List>
//                   {renderSubmissions('DM-006')}
//                 </List>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h5" component="h2" gutterBottom>
//                 DM-007
//               </Typography>
//               <Paper sx={{ p: 2 }}>
//                 <List>
//                   {renderSubmissions('DM-007')}
//                 </List>
//               </Paper>
//             </Grid>
//           </Grid>
//         </>
//       )}
//     </Container>
//   );
// };

// export default AdminPanel;
