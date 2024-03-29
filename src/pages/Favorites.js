import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import firebase, { db } from "../Firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ColorButton } from '../components/Styled';
import { Button } from '@mui/material';

// Navigate to detail page of the plant
const Details = (navigate, id) => {
  navigate("/plant/" + id);
};

const Favorites = () => {
const [data, setData] = useState([]);
const navigate = useNavigate();

useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const id = user.uid;

        // Fetch data from Firestore database based on user id (uid)
        const fetchData = async () => {
          try {
            const userDocRef = doc(db, 'users', id);
            const nestedCollectionRef = collection(userDocRef, 'favorites');
            const querySnapshot = await getDocs(nestedCollectionRef);

            const newData = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));

            console.log(newData);
            setData(newData);

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
      } else {
        setData([]);
        //console.log([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFavorite = async(id) => {
    try {
      const favoritesDocRef = doc(db, 'users', firebase.auth().currentUser.uid, 'favorites', id);
      await deleteDoc(favoritesDocRef);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  return (
    <div className='custom-container d-flex justify-content-center'>
      <div className='d-flex justify-content-center flex-column'>
        {data.map(item => (
          <div className='d-flex gap-5 align-items-baseline'>
            <div className="pb-4" key={item.id} style={{textTransform: 'capitalize'}}>
              {item.common_name}
            </div>
            <div>
              <ColorButton className="me-2" onClick={() => Details(navigate, item.plant_id)}>Details</ColorButton>
              <Button color="error" variant='outlined' onClick={() => removeFavorite(item.id)}>Remove</Button>
          </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Favorites;
