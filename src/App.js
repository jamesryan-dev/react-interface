import { useState, useEffect, useCallback } from 'react'
import { BiArchive } from "react-icons/bi"
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import Search from "./components/Search";


function App() {

  const [ appointmentList, setAppointmentList ] = useState([])
  const [query, setQuery] = useState('')
  const [ sortBy, setSortBy ] = useState("petName")
  const [ orderBy, setOrderBy] = useState('asc')

  const fetchData = useCallback( () => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      });
  }, [])

  const filteredAppointments = appointmentList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b)=> {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() 
      ? -1 * order : 1 * order
    )
  })


  useEffect( () => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <BiArchive className="inline-block text-red-400 align-top" />Your Appoitments</h1>
        <Search query={query} 
          onQueryChange={myQuery => setQuery(myQuery)}
          orderBy={orderBy}
          onOrderByChange={mySort => setOrderBy(mySort)}
          sortBy={sortBy}
          onSortByChange={mySort => setSortBy(mySort)} 
        />
      <AddAppointment onSendAppontment={myAppointment => setAppointmentList([...appointmentList, myAppointment])} lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id): max, 0)} />

      <ul>
        { filteredAppointments.map( appointment => (
          <AppointmentInfo key={appointment.id} appointment={appointment} onDeleteAppointment={
            appointmentId => setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId))
          }/>
        ))}
      </ul>
    </div>
  );
}

export default App;
