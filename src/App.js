import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AdminDetail from './AdminDetail';
import {
  ListItemText,
  createTheme, useMediaQuery, Container, Box, Paper, List, ListItem, TextField, Button, Typography,
  CircularProgress, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, TableCell,
  TablePagination, Chip, Grid, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from './firebaseConfig'; // Ensure your Firebase config is correctly imported
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const sortByDayOrder = (data) => {
  return data.sort((a, b) => {
    return dayOrder.indexOf(a.id) - dayOrder.indexOf(b.id);
  });
};

const renderTableData = (data, columns) => {
  const sortedData = sortByDayOrder(data);
  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} sx={{ fontWeight: 'bold', padding: '8px' }}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} sx={{ padding: '8px' }}>
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
};

const AdminList = ({ setLoggedIn, loggedIn }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [submissions, setSubmissions] = useState([]);
  const [userCheckIns, setUserCheckIns] = useState([]);

  const [condenserWater1, setCondenserWater1] = useState([]);
  const [chilledWater1, setChilledWater1] = useState([]);
  const [condenserChemicals1, setCondenserChemicals1] = useState([]);
  const [coolingTowerChemicals1, setCoolingTowerChemicals1] = useState([]);
  const [condenserWater2, setCondenserWater2] = useState([]);
  const [chilledWater2, setChilledWater2] = useState([]);
  const [condenserChemicals2, setCondenserChemicals2] = useState([]);
  const [coolingTowerChemicals2, setCoolingTowerChemicals2] = useState([]);
  const [additionalDataTable, setAdditionalDataTable] = useState([]);
  const [additionalDataTable2, setAdditionalDataTable2] = useState([]);
  const [notes1, setNotes1] = useState([]);
  const [notes2, setNotes2] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [rows, setRows] = useState([{ Name: '', Signature: '' }]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [detailsSubTabIndex, setDetailsSubTabIndex] = useState(0);
  const [waterTreatmentSubTabIndex, setWaterTreatmentSubTabIndex] = useState(0);
  const [showTabs, setShowTabs] = useState(false); // New state variable to manage tab visibility
  const [showTable, setShowTable] = useState(false); // New state variable to manage table visibility
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      background: { default: '#f8f9fa', paper: '#fff' },
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      h5: { fontSize: '1.5rem' },
      h6: { fontSize: '1.2rem' },
      body1: { fontSize: '0.9rem' },
      body2: { fontSize: '0.8rem' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: '20px',
            borderRadius: '10px',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '8px',
            fontSize: '14px',
          },
          head: {
            fontWeight: 'bold',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          subtitle1: {
            fontWeight: 'bold',
            color: '#666',
          },
          subtitle2: {
            fontWeight: 'bold',
            color: '#999',
          },
        },
      },
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      localStorage.setItem('loggedIn', 'true'); // Save login status to localStorage
    } else {
      alert('Incorrect username or password');
    }
  };

  const fetchNotes = async () => {
    try {
      const notesSnapshot1 = await getDocs(collection(db, 'notes'));
      const notesData1 = notesSnapshot1.docs.map(doc => doc.data());
      setNotes1(notesData1);

      const notesSnapshot2 = await getDocs(collection(db, 'notes2'));
      const notesData2 = notesSnapshot2.docs.map(doc => doc.data());
      setNotes2(notesData2);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch data for AD-001
      const chilledWater1Snapshot = await getDocs(collection(db, 'chilledWater1'));
      const chilledWater1Data = chilledWater1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChilledWater1(chilledWater1Data);

      const condenserWater1Snapshot = await getDocs(collection(db, 'condenserWater1'));
      const condenserWater1Data = condenserWater1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCondenserWater1(condenserWater1Data);

      const condenserChemicals1Snapshot = await getDocs(collection(db, 'condenserChemicals1'));
      const condenserChemicals1Data = condenserChemicals1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCondenserChemicals1(condenserChemicals1Data);

      const coolingTowerChemicals1Snapshot = await getDocs(collection(db, 'coolingTowerChemicals1'));
      const coolingTowerChemicals1Data = coolingTowerChemicals1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoolingTowerChemicals1(coolingTowerChemicals1Data);
      
      const additionalDataTableSnapshot = await getDocs(collection(db, 'additionalDataTable'));
      const additionalDataTableData = additionalDataTableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdditionalDataTable(additionalDataTableData);

      // Fetch data for AD-008
      const chilledWater2Snapshot = await getDocs(collection(db, 'chilledWater2'));
      const chilledWater2Data = chilledWater2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('chilledWater2Data',chilledWater2Data)
      setChilledWater2(chilledWater2Data);
      console.log('chileldWater2222',chilledWater2)

      const condenserWater2Snapshot = await getDocs(collection(db, 'condenserWater2'));
      const condenserWater2Data = condenserWater2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCondenserWater2(condenserWater2Data);

      const condenserChemicals2Snapshot = await getDocs(collection(db, 'condenserChemicals2'));
      const condenserChemicals2Data = condenserChemicals2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCondenserChemicals2(condenserChemicals2Data);

      const coolingTowerChemicals2Snapshot = await getDocs(collection(db, 'coolingTowerChemicals2'));
      const coolingTowerChemicals2Data = coolingTowerChemicals2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoolingTowerChemicals2(coolingTowerChemicals2Data);

      const additionalDataTable2Snapshot = await getDocs(collection(db, 'additionalDataTable2'));
      const additionalDataTable2Data = additionalDataTable2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdditionalDataTable2(additionalDataTable2Data);

      await fetchNotes();
      setLoading(false);

      // Set up real-time listeners
      const chilledWater1Unsubscribe = onSnapshot(collection(db, 'chilledWater1'), (snapshot) => {
        setChilledWater1(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const condenserWater1Unsubscribe = onSnapshot(collection(db, 'condenserWater1'), (snapshot) => {
        setCondenserWater1(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const condenserChemicals1Unsubscribe = onSnapshot(collection(db, 'condenserChemicals1'), (snapshot) => {
        setCondenserChemicals1(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const coolingTowerChemicals1Unsubscribe = onSnapshot(collection(db, 'coolingTowerChemicals1'), (snapshot) => {
        setCoolingTowerChemicals1(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const chilledWater2Unsubscribe = onSnapshot(collection(db, 'chilledWater2'), (snapshot) => {
        setChilledWater2(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const condenserWater2Unsubscribe = onSnapshot(collection(db, 'condenserWater2'), (snapshot) => {
        setCondenserWater2(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const condenserChemicals2Unsubscribe = onSnapshot(collection(db, 'condenserChemicals2'), (snapshot) => {
        setCondenserChemicals2(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const coolingTowerChemicals2Unsubscribe = onSnapshot(collection(db, 'coolingTowerChemicals2'), (snapshot) => {
        setCoolingTowerChemicals2(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const additionalDataTable2Unsubscribe = onSnapshot(collection(db, 'additionalDataTable2'), (snapshot) => {
        setAdditionalDataTable2(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const notesUnsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
        const notesData = snapshot.docs.map(doc => doc.data());
        setNotes1(notesData);
      });

      const notes2Unsubscribe = onSnapshot(collection(db, 'notes2'), (snapshot) => {
        const notesData = snapshot.docs.map(doc => doc.data());
        setNotes2(notesData);
      });

      return () => {
        chilledWater1Unsubscribe();
        condenserWater1Unsubscribe();
        condenserChemicals1Unsubscribe();
        coolingTowerChemicals1Unsubscribe();
        chilledWater2Unsubscribe();
        condenserWater2Unsubscribe();
        condenserChemicals2Unsubscribe();
        coolingTowerChemicals2Unsubscribe();
        additionalDataTable2Unsubscribe();
        notesUnsubscribe();
        notes2Unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCoolingTowerChemicalsTableData = (data) => {
    let chemicalsData, technicianInfo;
    if (waterTreatmentSubTabIndex === 0) {
        chemicalsData = coolingTowerChemicals1.filter(item => item.id !== 'metadata' && item.id !== 'technicianInfo' && item.id !== 'signature' && item.id !== 'technicianName');
       technicianInfo = coolingTowerChemicals1.find(item => item.id === 'technicianInfo');
    } else 
    
    {
      technicianInfo = coolingTowerChemicals2.find(item => item.id === 'technicianInfo');
      chemicalsData = coolingTowerChemicals2.filter(item => item.id !== 'metadata' && item.id !== 'technicianInfo' && item.id !== 'signature' && item.id !== 'technicianName');
}
    
    return (
      <Box sx={{ padding: '16px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {chemicalsData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '8px' }}>{row.label}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{row.value}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {technicianInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 3 }}>
              <Typography variant="body1" sx={{ flex: 1 }}>
                Name: {technicianInfo?.name || 'N/A'}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid lightgrey',
                  height: '50px',
                  padding: '8px',
                }}
              >
                {technicianInfo.signature ? (
                  <img src={technicianInfo?.signature} alt="Signature" style={{ width: '100px', height: '50px' }} />
                ) : (
                  'N/A'
                )}
              </Box>
            </Box>
          )}
        </TableContainer>
      </Box>
    );
  };

  const renderChilledTableData = (data) => {
    if (!data || data.length === 0) {
      return <Typography>No data available</Typography>;
    }
  
    console.log('datamain', data);
    
    const mainData = data.find(item => item.id !== 'signature' && item.id !== 'technicianInfo');
    const technicianInfo = data.find(item => item.id === 'technicianInfo')?.name || 'N/A';
    const signature = data.find(item => item.id === 'signature')?.signature || 'N/A';
  
    if (!mainData) {
      return <Typography>No data available</Typography>;
    }
  
    return (
      <Box sx={{ padding: '16px' }}>
        <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 3 }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px' }}>Day</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px' }}>Conductivity(µS/cm)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow> 
                <TableCell sx={{ padding: '8px' }}>{mainData?.['Day']}</TableCell>
                <TableCell sx={{ padding: '8px' }}>{mainData?.['Conductivity(µS/cm)']}</TableCell>
                <TableCell sx={{ padding: '8px' }}>{mainData?.Action}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body1">Name: {technicianInfo}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Signature:</Typography>
            {signature !== 'N/A' ? (
              <img src={signature} alt="Signature" style={{ width: '100px', height: '50px' }} />
            ) : (
              <Typography variant="body1">N/A</Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };
  
  const renderCondenserChemicalTableData = (data) => {
    if (!data || data.length === 0) return <Typography>No data available</Typography>;

    const metadata = data.find(item => item.id === 'metadata') || {};
    const technicianInfo = data.find(item => item.id === 'technicianInfo') || {};

    const filteredData = data.filter(item => item.id !== 'metadata' && item.id !== 'technicianInfo' && item.id !== 'signature' && item.id !== 'technicianName');

    return (
      <>
        <TableContainer component={Paper} sx={{ padding: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Stocks</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Opening Stock (Kg)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Closing Stock (Kg)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }}>Consumption (Kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '8px' }}>{row?.id.replace(/_/g, " ")}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{row['Opening Stock (Kg)']}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{row['Closing Stock (Kg)']}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{row['Consumption (Kg)']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body1">Name: {technicianInfo.name || metadata.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Signature:</Typography>
            {technicianInfo.signature !== 'N/A' ? (
              <img src={technicianInfo.signature || metadata.signature} alt="Signature" style={{ width: '100px', height: '50px' }} />
            ) : (
              <Typography variant="body1">N/A</Typography>
            )}
          </Box>
        </Box>
      </>
    );
  };

  const renderNotes = (data) => {
    console.log('note',data[0].notes)
    const main = data.find(id=>id === id)
    return (
  
      <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[0] && data[0].notes.map((note, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    {note}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body1">Name: {data[0] && data[0].name || ''}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>Signature:</Typography>
          {data[0] && data[0].signature !== 'N/A' ? (
            <img src={data[0] && data[0]?.signature || ''} alt="Signature" style={{ width: '100px', height: '50px' }} />
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Box>
      </Box>
        </>
)
  }
 


  const renderAdditionalData = (data) => (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.label}</TableCell>
                        <TableCell>
                            {item.type === 'date' && item.value ? 
                                new Date(item.value).toLocaleDateString() : 
                                item.value
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

  const renderSubmissions = (plantName) => {
    return submissions
      .filter(submission => submission.plantName === plantName)
      .map((submission, index) => (
        <ListItem key={submission.id} button onClick={() => navigate(`/admin/${submission.id}`)}>
          <Typography variant="body1" sx={{ color: '#000', marginRight: '10px' }}>
            {index + 1}.
          </Typography>
          <ListItemText
            primary={submission.date}
            secondary={`Time: ${submission.time}`}
            sx={{ color: '#000' }}
          />
        </ListItem>
      ));
  };

  const renderPlantVisitorLog = (plantName) => {
    const filteredCheckIns = userCheckIns
      .filter(checkIn => checkIn.plantName === plantName)
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

    const downloadPDF = () => {
      const input = document.getElementById(`pdf-content-${plantName}`);
      html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth - 40, pdfHeight - 40); // Adjust for padding
        pdf.save(`visitor_log_${plantName}.pdf`);
      });
    };

    return (
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search with Name or Phone No."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mr: 2 }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="visitor log table" id={`pdf-content-${plantName}`}>
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
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ mt: 2 }}>
          Download {plantName} Log as PDF
        </Button>
        <TablePagination
          component="div"
          count={filteredCheckIns.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    );
  };

  const renderAD001Data = () => (
    <Box>
      <Box sx={{ mt: 3 }}>
        <WaterTreatmentHeader />
      </Box>
      <Typography variant="h6" gutterBottom>Make-Up Condenser Water</Typography>
      {renderTableData(condenserWater1, ['id', 'Makeup Conductivity (µS/cm)', 'Condenser Conductivity (µS/cm)', 'Free Chlorine', 'Action', 'Name', 'Signature'])}

      <Typography variant="h6" gutterBottom>Chilled Water</Typography>
      {renderChilledTableData(chilledWater1)}

      <Typography variant="h6" gutterBottom>CT Cleaning Chemicals</Typography>
      {renderCondenserChemicalTableData(condenserChemicals1)}

      <Typography variant="h6" gutterBottom>Cooling Tower Chemicals</Typography>
      {renderCoolingTowerChemicalsTableData(coolingTowerChemicals1)}

      <Typography variant="h6" gutterBottom>Additional Data</Typography>
      {renderAdditionalData(additionalDataTable)}

      <Typography variant="h6" gutterBottom>Notes</Typography>
      {renderNotes(notes1)}
    </Box>
  );

  const renderAD008Data = () => (
    <Box>
      <Box sx={{ mt: 3 }}>
        <WaterTreatmentHeader />
      </Box>
      <Typography variant="h6" gutterBottom>Make-Up Condenser Water</Typography>
      {renderTableData(condenserWater2, ['id', 'Makeup Conductivity (µS/cm)', 'Condenser Conductivity (µS/cm)', 'Free Chlorine', 'Action', 'Name', 'Signature'])}

      <Typography variant="h6" gutterBottom>Chilled Water</Typography>
      {renderChilledTableData(chilledWater2)}

      <Typography variant="h6" gutterBottom>CT Cleaning Chemicals</Typography>
      {renderCondenserChemicalTableData(condenserChemicals2)}

      <Typography variant="h6" gutterBottom>Cooling Tower Chemicals</Typography>
      {renderCoolingTowerChemicalsTableData(coolingTowerChemicals2)}

      <Typography variant="h6" gutterBottom>Additional Data</Typography>
      {renderAdditionalData(additionalDataTable2)}
      <Typography variant="h6" gutterBottom>Notes</Typography>
      {renderNotes(notes2)}
    </Box>
  );

  const WaterTreatmentHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Typography variant="h5" component="h1">
        Water Treatment Weekly Report
      </Typography>
      <Typography variant="subtitle1" component="h2">
        Week Commencing Sunday: 4th August 2024 to 10th August 2024
      </Typography>
      {/* <Chip label="Plant Name: AD-001" color="primary" size="small" sx={{ mt: 0.5 }} /> */}
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

  const handleListItemClick = () => {
    setShowTabs(true);
    setShowTable(true);
  };

  const handleBackClick = () => {
    setShowTable(false);
  };

  if (!loggedIn) {
    return (
      <Container component={Paper} sx={{ p: 3, mt: 3, minHeight: '100vh', backgroundColor: '#fff' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4">Login</Typography>
          </Box>
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container component={Paper} sx={{ p: 3, mt: 3, minHeight: '100vh', backgroundColor: '#fff' }}>
      <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{ color: '#000' }}>
        Admin Panel
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
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
                <Tab label="AD-001" />
                <Tab label="AD-008" />
                <Tab label="CDC Plant" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {detailsSubTabIndex === 0 && (
                  <List dense>
                    {renderSubmissions('AD-001')}
                  </List>
                )}
                {detailsSubTabIndex === 1 && (
                  <List dense>
                    {renderSubmissions('AD-008')}
                  </List>
                )}
                {detailsSubTabIndex === 2 && (
                  <List dense>
                    {renderSubmissions('CDC Plant')}
                  </List>
                )}
              </Box>
            </Box>
          )}
          {tabIndex === 1 && (
            <Box sx={{ mt: 3 }}>
              <Tabs value={detailsSubTabIndex} onChange={handleDetailsSubTabChange} centered>
                <Tab label="AD-001" />
                <Tab label="AD-008" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {detailsSubTabIndex === 0 && renderPlantVisitorLog('AD-001')}
                {detailsSubTabIndex === 1 && renderPlantVisitorLog('AD-008')}
              </Box>
            </Box>
          )}
          {tabIndex === 2 && (
            <Box sx={{ mt: 3 }}>
              {showTabs ? (
                <>
                  {showTable ? (
                    <>
                      <IconButton onClick={handleBackClick}>
                        <ArrowBackIcon />
                      </IconButton>
                      <Tabs value={waterTreatmentSubTabIndex} onChange={handleWaterTreatmentSubTabChange} centered>
                        <Tab label="AD-001" />
                        <Tab label="AD-008" />
                      </Tabs>
                      <Box sx={{ mt: 2 }}>
                        {waterTreatmentSubTabIndex === 0 && renderAD001Data()}
                        {waterTreatmentSubTabIndex === 1 && renderAD008Data()}
                      </Box>
                    </>
                  ) : (
                    <List>
                      <ListItem button onClick={handleListItemClick} sx={{ backgroundColor: '#e0e0e0', borderRadius: '10px', mb: 2 }}>
                        <ListItemText primary="1. Week Commencing 4th August 2024 to 10th August 2024" />
                      </ListItem>
                    </List>
                  )}
                </>
              ) : (
                <List>
                  <ListItem button onClick={handleListItemClick} sx={{ backgroundColor: '#e0e0e0', borderRadius: '10px', mb: 2 }}>
                    <ListItemText primary="1. Week Commencing 4th August 2024 to 10th August 2024" />
                  </ListItem>
                </List>
              )}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isUserLoggedIn);
  }, []);

  const handleLogin = (username, password) => {
    if (username === 'mnoushad@tabreed.ae' && password === '#Admin%Tabreed*') {
      setLoggedIn(true);
      localStorage.setItem('loggedIn', 'true');
    } else {
      alert('Incorrect username or passwor2d');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AdminList setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
        />
        <Route
          path="/admin/:id"
          element={loggedIn ? <AdminDetail onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
