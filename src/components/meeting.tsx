import { useState } from "react";
import { MeetingForm, createMeeting, getMeetings, Meeting, deleteMeetingbyId } from "../api/requests";



export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newMeeting, setNewMeeting] = useState<MeetingForm>({
    address: "",
    time: 0,
    summary: ""
  });

  const [selectedMeetingId, setSelectedMeetingId] = useState(0);

  const handleCreateMeeting = async () => {
    const createdMeeting = await createMeeting(newMeeting);
    setMeetings([...meetings, createdMeeting]);
    setNewMeeting({
      address: "",
      time: 0,
      summary: ""
    });
  };

  const handleNewMeetingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Update time property if name is 'time'
    const newValue = name === 'time' ? new Date(value).getTime() : value;
  
    // Update state
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      [name]: newValue
    }));
  };
  
 
  useState(() => {
    (async () => {
      const meetings = await getMeetings();
      setMeetings(meetings);
    })();
  });
  

  return <>
    <div>
      {/* <form onSubmit={handleCreateMeeting}
        style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
      > */}
       <div>
         <label>Address:</label>
    
         <input type="text" name="address" value={newMeeting.address} onChange={handleNewMeetingChange} />       
         <label>Time:</label>
            
        <input
            type="datetime-local"
            name="time"
            value={newMeeting.time ? new Date(newMeeting.time).toISOString().slice(0, -8) : ''}
            onChange={handleNewMeetingChange}
            />

         <label>Summary:</label>
         <input type="text" name="summary" value={newMeeting.summary} onChange={handleNewMeetingChange} />
       
       <button onClick={handleCreateMeeting}>Create Meeting</button>
       </div>
       

      <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ccc', padding: '3px' }}>Meeting Id</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Address</th>
              <th style={{ border: '1px solid #ccc', padding: '5px' }}>Time</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Description</th>
            </tr>
          </thead>
          <tbody>

          {meetings.map((meeting) => (

            <tr key={meeting.meeting_id}>
                <td style={{ border: '1px solid #ccc', padding: '3px' }}>
                    <a href="#" onClick={() => setSelectedMeetingId(meeting.meeting_id)}>{meeting.meeting_id}</a>
                    </td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.address}</td>
                {/* <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.time}</td> */}
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{new Date(meeting.time).toLocaleString('en-US')}</td>

                {/* <td style={{ border: '1px solid #ccc', padding: '5px' }}>{new Date(meeting.time).toLocaleString('en-US', { timeZone: 'UTC' })}</td> */}

                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.summary}</td>
                
            </tr>
              ))}
         </tbody>
        </table>
      </div>
      </div>
      </>
}

export default MeetingsPage;
