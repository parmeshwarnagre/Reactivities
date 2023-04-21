import React, {useEffect, useState } from 'react';

import { Container } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities]= useState<Activity[]>([]);
  const [SelectedActivity,setSelectedActivity]=useState<Activity | undefined>(undefined);
  const [editMode,setEditMode]=useState(false);
  const[loading, setLoading]=useState(true);
  const[submitting, setSubmitting]=useState(false);


  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[]= [];
      response.forEach(activity=>{
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
    })
      setActivities(activities);
      setLoading(false);
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
  function handleDeleteActivity(id: string){
    setSubmitting(true);
    console.log('error in 1 app.tsx')
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x=>x.id !==id)]);
      setSubmitting(false);
      console.log('error in 2 app.tsx')
    })
    
  }
function handleCreateOrEditActivity(activity: Activity){
  setSubmitting(true);
  if(activity.id){
    agent.Activities.update(activity).then(()=>{
      setActivities([...activities.filter(x=>x.id !==activity.id),activity])
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    })
  }
  else{
    activity.id=uuid();
    agent.Activities.create(activity).then(()=>{
      setActivities([...activities,activity]);
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    })
  }
}
if(loading) return<LoadingComponent content='Loading app'/>

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
        submitting={submitting}
        />
      </Container>  
    </>
  );
}

export default App;
