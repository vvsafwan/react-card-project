import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea,CircularProgress } from '@mui/material';
import './App.css';
import { UserData } from './models/dataModel'; 
import Dexie from 'dexie';
import  {db}  from './dexiedatabase';

function App() {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<UserData[]>([]);   
  const [totalUsers, setTotalUsers] = React.useState<number>(0);

  

  React.useEffect(() => {
    fetchData();
  }, []);

  function generateRandom6DigitNumber(): string {
    let random6DigitNumber = '';
    for (let i = 0; i < 12; i++) {
      const digit = Math.floor(Math.random() * 10);
      random6DigitNumber += digit;
    }
    return random6DigitNumber;
  }

  const fetchData = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=50');
      const data = await response.json();
      const userData = data.results;
      
      for(let i=0;i<userData.length;i++){
        userData[i].id = parseInt(generateRandom6DigitNumber());
      }

      await db.users.bulkAdd(userData);
      
      setUsers(userData);
      setTotalUsers(userData.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleDeleteUser = async (id: any ) => {
    try {
      await db.users.where('id').equals(id).delete();
  
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setTotalUsers((prevTotal) => prevTotal - 1);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const RefreshData = () => {
    setLoading(true);
    fetchData();
  };
  return (
    <div className="container">
      <div className='totalItem pt-5'>
        <div>
          <button className='btn btn-warning' onClick={RefreshData}>Refresh</button>
        </div>
        <div>
          <h1>Total Cards: {totalUsers}</h1>
        </div>
      </div>
      {loading ? (
        <div className='centerloader'>
          <CircularProgress />
        </div>
      ) : (
        <div className="row">
          {users.map((cardData) => (
            <div className='col-md-3 col-sm-6 col-12 mt-5' key={cardData.email}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={cardData.picture.large} // Assuming image URL is stored in the 'image' field
                    alt="User"
                  />
                  <CardContent>
                    <Typography className='text-center' gutterBottom variant="h5" component="div">
                      {cardData.name.title} {cardData.name.first} {cardData.name.last}
                    </Typography>
                    <div className='mt-3 mb-3 text-center'>
                      <button className='btn btn-danger' onClick={() => handleDeleteUser(cardData.id)}>DELETE</button>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
      </div>
      )}
    </div>
  );
}

export default App;


