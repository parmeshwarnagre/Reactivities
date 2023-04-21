import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities]= useState<Activity[]>([]);
  const [SelectedActivity,setSelectedActivity]=useState<Activity | undefined>(undefined);
  const [editMode,setEditMode]=useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response =>{
      setActivities(response.data);
    })
  },[]) //this to execute this function once otherwise it will execute infinitely

  function handleSelectedActivity(id:string){
    setSelectedActivity(activities.find(x=>x.id===id));
  }
  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }
  function handleFormOpen(id?: string){
    id? handleSelectedActivity(id):handleCancelSelectActivity();//if id is present
    setEditMode(true);
  }
  function handleFormClose(){
    setEditMode(false);
  }
  function handleDeleteActivity(id:string){
    setActivities([...activities.filter(x=>x.id !==id)])
  }
function handleCreateOrEditActivity(activity: Activity){
  activity.id ? 
              setActivities([...activities.filter(x=>x.id !==activity.id),activity])
              :setActivities([...activities,{...activity,id:uuid()}]);
            setEditMode(false);
            setSelectedActivity(activity);

}

  return (
    < > //Fragment or Div is required to return multiple data
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard 
        activities={activities}
        selectedActivity={SelectedActivity}
        selectActivity={handleSelectedActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEdit={handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
        />
      </Container>  
    </>
  );
}

export default App;
