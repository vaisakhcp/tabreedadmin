import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import {
  Container, Box, Paper, List, ListItem, ListItemText, TextField, Button, Typography,
  useMediaQuery, createTheme, ThemeProvider, CircularProgress, Tabs, Tab, ListItemIcon,
  Table, TableBody, TableContainer, TableHead, TableRow, TableCell, TablePagination, Chip, Grid, IconButton
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { format } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: blue[700],
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#5f6368',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const AdminList = ({ setLoggedIn, loggedIn }) => {
  const [submissions, setSubmissions] = useState([]);
  const [userCheckIns, setUserCheckIns] = useState([]);
  const [condenserWater, setCondenserWater] = useState([]);
  const [chilledWater, setChilledWater] = useState([]);
  const [condenserChemicals, setCondenserChemicals] = useState([]);
  const [coolingTowerChemicals, setCoolingTowerChemicals] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [rows, setRows] = useState([{ Name: '', Signature: '' }]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [detailsSubTabIndex, setDetailsSubTabIndex] = useState(0);
  const [waterTreatmentSubTabIndex, setWaterTreatmentSubTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleDetailsSubTabChange = (event, newSubIndex) => {
    setDetailsSubTabIndex(newSubIndex);
  };

  const handleWaterTreatmentSubTabChange = (event, newSubIndex) => {
    setWaterTreatmentSubTabIndex(newSubIndex);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogin = () => {
    if (username === 'mnoushad@tabreed.ae' && password === '#Admin%Tabreed*') {
      setLoggedIn(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text('Visitor Log Report', 20, 10);
    const tableData = filteredCheckIns.flatMap((checkIn, index) =>
      checkIn.checkIns.map((ci) => [
        index + 1,
        checkIn.name,
        checkIn.companyName,
        checkIn.purpose,
        checkIn.phoneNumber,
        ci.checkInDate,
        ci.checkInTime,
        ci.checkOutDate || 'Not checked out yet',
        ci.checkOutTime || 'Not checked out yet',
        ci.signature ? { content: '', image: ci.signature, fit: [30, 10] } : 'N/A'
      ])
    );
    doc.autoTable({
      head: [['No.', 'Name', 'Company', 'Purpose', 'Phone Number', 'Check-in Date', 'Check-in Time', 'Check-out Date', 'Check-out Time', 'Signature']],
      body: tableData,
      didDrawCell: (data) => {
        if (data.column.dataKey === 9 && data.cell.raw.image) {
          doc.addImage(data.cell.raw.image, 'PNG', data.cell.x + 2, data.cell.y + 2, 30, 10);
        }
      },
    });
    doc.save('visitor_log_report.pdf');
  };

  const fetchNotes = async () => {
    try {
      const notesSnapshot = await getDocs(collection(db, 'notes'));
      const notesData = notesSnapshot.docs.map(doc => doc.data());
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const fetchData = async () => {

    try {
      setLoading(true);

      const userCheckInsSnapshot = await getDocs(collection(db, 'userCheckIns'));
      const userCheckInsData = userCheckInsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched userCheckIns: ', userCheckInsData);
      setUserCheckIns(userCheckInsData);

      const submissionsSnapshot = await getDocs(collection(db, 'shiftHandOvers'));

      const submissionsData = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched submissions: ', submissionsData);
      setSubmissions(submissionsData);

      const condenserWaterSnapshot = await getDocs(collection(db, 'condenserWater'));
      const condenserWaterData = condenserWaterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched condenserWater: ', condenserWaterData);
      setCondenserWater(condenserWaterData);

      const chilledWaterSnapshot = await getDocs(collection(db, 'chilledWater'));
      const chilledWaterData = chilledWaterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched chilledWater: ', chilledWaterData);
      setChilledWater(chilledWaterData);

      const condenserChemicalsSnapshot = await getDocs(collection(db, 'condenserChemicals'));
      const condenserChemicalsData = condenserChemicalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched condenserChemicals: ', condenserChemicalsData);
      setCondenserChemicals(condenserChemicalsData);

      const coolingTowerChemicalsSnapshot = await getDocs(collection(db, 'coolingTowerChemicals'));
      const coolingTowerChemicalsData = coolingTowerChemicalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched coolingTowerChemicals: ', coolingTowerChemicalsData);
      setCoolingTowerChemicals(coolingTowerChemicalsData);

      const additionalDataSnapshot = await getDocs(collection(db, 'additionalTable'));
      const additionalDataContent = additionalDataSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched additionalData: ', additionalDataContent);
      setAdditionalData(additionalDataContent);

      await fetchNotes();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTableData = (data, columns) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column === 'Signature' && row[column] ? (
                    <img src={row[column]} alt="Signature" style={{ width: '100px', height: '50px' }} />
                  ) : (
                    row[column]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const filteredCheckIns = userCheckIns
    .filter(checkIn => {
      const queryMatch = checkIn.name.toLowerCase().includes(searchQuery.toLowerCase()) || checkIn.phoneNumber.includes(searchQuery);
      const startDateMatch = startDate ? new Date(checkIn.checkIns[0].checkInDate) >= startDate : true;
      const endDateMatch = endDate ? new Date(checkIn.checkIns[0].checkInDate) <= endDate : true;
      return queryMatch && startDateMatch && endDateMatch;
    })
    .sort((a, b) => {
      const latestCheckOutA = Math.max(...a.checkIns.map(ci => ci.checkOutDate ? new Date(ci.checkOutDate + ' ' + ci.checkOutTime).getTime() : new Date(ci.checkInDate + ' ' + ci.checkInTime).getTime()));
      const latestCheckOutB = Math.max(...b.checkIns.map(ci => ci.checkOutDate ? new Date(ci.checkOutDate + ' ' + ci.checkOutTime).getTime() : new Date(ci.checkInDate + ' ' + ci.checkInTime).getTime()));
      return latestCheckOutB - latestCheckOutA;
    });

  const renderSubmissions = (plantName) => {
    return submissions
      .filter(submission => submission.plantName === plantName)
      .map((submission, index) => (
        <ListItem key={submission.id} button component={Link} to={`/admin/${submission.id}`}>
          <ListItemIcon>
            <Typography variant="body1" sx={{ color: '#000' }}>
              {index + 1}.
            </Typography>
          </ListItemIcon>
          <ListItemText
            primary={format(new Date(submission.date), 'dd/MM/yyyy')}
            secondary={`Time: ${submission.time}`}
            sx={{ color: '#000' }}
          />
        </ListItem>
      ));
  };

  const WaterTreatmentHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <img src={require('./logo.png')} alt="Logo" style={{ width: isMobile ? '50%' : '150px', marginBottom: '5px' }} />
      <Typography variant={isMobile ? 'h6' : 'h5'} component="h1">
        Water Treatment Weekly Report
      </Typography>
      <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="h2">
        Week Commencing Sunday : 28th July 2024 to 3rd August 2024
      </Typography>
      <Chip label="Plant Name: AD-002" color="primary" size="small" sx={{ mt: 0.5 }} />
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Operations Department: TOM-OPS-FM-2009</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Revision 03 Dated: 25/10/2021</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Replaces Revision 02 of: 19/03/2005</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const renderListData = (data) => (
    
    <List dense>
      {data.flatMap(item => item.notes).map((note, index) => ( 
        <ListItem key={index}>
          <ListItemIcon>
            <Typography variant="body1" sx={{ color: '#000' }}>
              {index + 1}.
            </Typography>
          </ListItemIcon>
          <ListItemText primary={note} sx={{ color: '#000' }} />
        </ListItem>
      ))}
    </List>
  );
  
  const renderNotes = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Notes</Typography>
      <List>
        {notes.map((note, index) => (
          <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={note} />
          </ListItem>
        ))}
        <ListItem>
          <TextField
            fullWidth
            variant="outlined"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add a note"
          />
          <IconButton color="primary" onClick={() => setNotes([...notes, noteInput])}>
            <AddIcon />
          </IconButton>
        </ListItem>
      </List>
      <Box sx={{ mt: 4 }}>
        <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px' }}>Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ padding: '8px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Name"
                    value={rows[0]?.['Name'] || ''}
                    onChange={(e) => setRows([{ ...rows[0], Name: e.target.value }])}
                    sx={{ '& .MuiInputBase-root': { height: '56px' } }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '8px' }}>
                  <div
                    style={{
                      cursor: 'pointer',
                      border: '1px solid #000',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: -4,
                      backgroundColor: rows[0]?.['Signature'] ? 'transparent' : '#f0f0f0'
                    }}
                  >
                    {rows[0]?.['Signature'] ? (
                      <img src={rows[0]?.['Signature']} alt="Signature" style={{ width: '100px', height: '50px' }} />
                    ) : (
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Click to Sign
                      </Typography>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component={Paper} sx={{ p: 3, mt: 3, minHeight: '100vh', backgroundColor: theme.palette.background.paper }}>
        {!loggedIn ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img src={require('./logo.png')} alt="Logo" style={{ height: '50px' }} />
            </Box>
            <Box sx={{ maxWidth: 400, width: '100%' }}>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{ style: { color: '#000' } }}
                InputProps={{
                  style: { color: '#000' },
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: '#000' } }}
                InputProps={{
                  style: { color: '#000' },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                sx={{ mb: 2 }}
              >
                Connect
              </Button>
              <Typography variant="body2" align="center" sx={{ color: '#000' }}>
                <Link to="/forgot-password" style={{ color: '#000', textDecoration: 'none', marginRight: 10 }}>
                  Forgot your password?
                </Link>
                -
                <Link to="/question" style={{ color: '#000', textDecoration: 'none', marginLeft: 10 }}>
                  Question?
                </Link>
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img src={require('./logo.png')} alt="Logo" style={{ height: '50px', margin: 20 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{ color: '#000' }}>
              Admin Panel
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange} centered   variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile>
              <Tab label="Shift Transfer Log" />
              <Tab label="Plant Visitor Log" />
              <Tab label="Water Treatment Log" />
            </Tabs>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <>
               {tabIndex === 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Tabs value={detailsSubTabIndex} onChange={handleDetailsSubTabChange} centered>
                       <Tab label="AD-002" />
                      <Tab label="AD-009" />
                    </Tabs>
                    <Box sx={{ mt: 2 }}>
                      {detailsSubTabIndex === 0 && (
                        <List dense>
                          {renderSubmissions('AD-002')}
                        </List>
                      )}
                      {detailsSubTabIndex === 1 && (
                        <List dense>
                          {renderSubmissions('AD-009')}
                        </List>
                      )}
                    </Box>
                  </Box>
                )}
                {tabIndex === 1 && (
                  <Box sx={{ mt: 3 }}>
                    <Tabs value={detailsSubTabIndex} onChange={handleDetailsSubTabChange} centered>
                      <Tab label="AD-002" />
                      <Tab label="AD-009" />
                    </Tabs>
                    <Box sx={{ mt: 2 }}>
                      {detailsSubTabIndex === 0 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <TextField
                              label="Search with Name or Phone No."
                              variant="outlined"
                              fullWidth
                              value={searchQuery}
                              onChange={handleSearchChange}
                              sx={{ mr: 2 }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} />}
                              />
                              <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
                            <Button variant="contained" color="primary" onClick={handleDownloadReport} sx={{ ml: 2 }}>
                              Search
                            </Button>
                          </Box>
                          <Button variant="contained" color="primary" onClick={handleDownloadReport} sx={{ mb: 2 }}>
                            Download Report
                          </Button>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="visitor log table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>No.</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Company</TableCell>
                                  <TableCell>Purpose</TableCell>
                                  <TableCell>Phone Number</TableCell>
                                  <TableCell>Check-in Date</TableCell>
                                  <TableCell>Check-in Time</TableCell>
                                  <TableCell>Check-out Date</TableCell>
                                  <TableCell>Check-out Time</TableCell>
                                  <TableCell>Signature</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredCheckIns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((checkIn, index) =>
                                  checkIn.checkIns.map((ci, ciIndex) => (
                                    <TableRow key={`${checkIn.id}-${ciIndex}`}>
                                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                      <TableCell>{checkIn.name}</TableCell>
                                      <TableCell>{checkIn.companyName}</TableCell>
                                      <TableCell>{checkIn.purpose}</TableCell>
                                      <TableCell>{checkIn.phoneNumber}</TableCell>
                                      <TableCell>{ci.checkInDate}</TableCell>
                                      <TableCell>{ci.checkInTime}</TableCell>
                                      <TableCell sx={{ color: ci.checkOutDate ? 'inherit' : 'red' }}>
                                        {ci.checkOutDate || 'Not checked out yet'}
                                      </TableCell>
                                      <TableCell sx={{ color: ci.checkOutTime ? 'inherit' : 'red' }}>
                                        {ci.checkOutTime || 'Not checked out yet'}
                                      </TableCell>
                                      <TableCell>
                                        {ci.signature ? <img src={ci.signature} alt="Signature" style={{ width: '100px', height: '50px' }} /> : 'N/A'}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            component="div"
                            count={filteredCheckIns.length}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                          />
                        </Box>
                      )}
                      {detailsSubTabIndex === 1 && (
                        <Box>
                          {/* Render archived data or other content for the second sub-tab */}
                          {/* Example: <Typography>Archived Data</Typography> */}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                {tabIndex === 2 && (
                  <Box sx={{ mt: 3 }}>
                    <Tabs value={waterTreatmentSubTabIndex} onChange={handleWaterTreatmentSubTabChange} centered>
                    <Tab label="AD-002" />
                    <Tab label="AD-009" />
                    </Tabs>
                    <Box sx={{ mt: 2 }}>
                      {waterTreatmentSubTabIndex === 0 && (
                            <Box>
                              <Box sx={{ mt: 3 }}>
                              <WaterTreatmentHeader />
                                </Box>
            
                          <Typography variant="h6" gutterBottom>Make-Up Condenser Water</Typography>
                          {renderTableData(condenserWater, ['Day', 'Makeup Conductivity', 'Condenser Conductivity', 'Free Chlorine', 'Action'])}
{JSON.stringify(chilledWater)}
                          <Typography variant="h6" gutterBottom>Chilled Water</Typography>
                          {renderTableData(chilledWater, ['Day', 'Conductivity', 'Action','Name','Signature'])}

                          <Typography variant="h6" gutterBottom>Condenser Chemicals</Typography>
                          {renderTableData(condenserChemicals, ['Product Name', 'Opening Stock (Kg)', 'Closing Stock (Kg)', 'Consumption (Kg)'])}

                          <Typography variant="h6" gutterBottom>Cooling Tower Chemicals</Typography>
                          {renderTableData(coolingTowerChemicals, ['Product Name', 'Available empty Jerry Cans in plants (06-11-2022)'])}
                          <Typography variant="h6" gutterBottom>Notes</Typography>
                          {renderListData(notes)}

                        
                       
                        </Box>
                      )}
                      {waterTreatmentSubTabIndex === 1 && (
                        <Box>
                          {/* Blank content for now */}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default AdminList;
