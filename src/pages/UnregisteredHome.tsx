import React, { useEffect, useState } from 'react';
import { text } from 'stream/consumers';
import { createComplaint, ComplaintForm, Complaint, getMeetings, Meeting } from '../api/requests';

type UnregisteredHomeProps = {
  onLogout: () => void;
  user: any
};

const UnregisteredHome = ({ onLogout, user }: UnregisteredHomeProps) => {
  const [complaintForm, setComplaintForm] = useState<Complaint>({
    complaint_id: 0,
    description: '',
    status: "UN-REVIEWED",
    meeting_id: -1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComplaintForm((prevForm) => ({
      ...prevForm,
      description: e.target.value
    }));
  };

  const [newComplaintId, setNewComplaintId] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newComplaint = await createComplaint(complaintForm);
      
      setNewComplaintId(newComplaint.complaint_id);
      setIsCreated(true)
      setComplaintForm({
        complaint_id: 0,
        description: '',
        status: "UN-REVIEWED",
        meeting_id: -1
      });
    } catch (error) {
      console.error(error);
    }
  };

  useState(() => {
    (async () => {
      const meetings = await getMeetings();
      setMeetings(meetings);
    })();
  });

  const[isCreated, setIsCreated] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCreated) {
      timer = setTimeout(() => {

        setIsCreated(false);
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isCreated]);

  const [currentPage, setCurrentPage] = useState(0);

  const meetingsPerPage = 10;
  const totalPages = Math.ceil(meetings.length / meetingsPerPage);

  //$$$$$$$$section for trying display images on a interval$$$$$$$$$
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    // Create an array of image URLs
    const images = [
      'https://picsum.photos/id/1015/1920/1080',
      'https://picsum.photos/id/1016/1920/1080',
      'https://picsum.photos/id/1018/1920/1080',
      'https://picsum.photos/id/102/1920/1080',
      'https://picsum.photos/id/1024/1920/1080',
      'https://picsum.photos/id/1028/1920/1080',
      'https://picsum.photos/id/1048/1920/1080',
      'https://picsum.photos/id/1058/1920/1080',
      'https://picsum.photos/id/1038/1920/1080'
    ];

    // Set a random background image from the array
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);

    // Change the background image every 4 seconds
    const interval = setInterval(() => {
      const newImage = images[Math.floor(Math.random() * images.length)];
      setBgImage(newImage);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  return (

<div>

<div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontFamily: 'Open Sans', 
        fontSize :'18px'
      }}>
        <h3>Welcome {user.userName} ({user.role})</h3>
        <button onClick={onLogout}>Back to SignIn</button>
      </div>

    <div className="wrapper" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'  }}>


    

    <div className="guest-container">
    
    <div className="guest-left-section">

      
   
   
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
      >
        <div style={{fontFamily: 'Open Sans', fontSize :'18px'}}>
          <label htmlFor="description">Enter the Complaint Description</label>
          <p></p>
          <textarea name="description" value={complaintForm.description} onChange={handleInputChange} rows={5} cols={70} style={{ fontSize: '16px' }}></textarea>
          <button type="submit">Add Complaint</button>
        </div>

      </form>

      {isCreated && (
        <p>New complaint created with ID: {newComplaintId}</p>
      )}
      
      <div style={{fontFamily: 'Open Sans', fontSize :'18px'}}>
      <label htmlFor="description"><u> Available list of Meetings </u></label>
      </div>
      <p></p>
      <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '99%', borderCollapse: 'collapse' , border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ccc', padding: '3px' }}>Meeting#</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Address</th>
              <th style={{ border: '1px solid #ccc', padding: '5px' }}>Time</th>
              <th style={{ border: '1px solid #ccc', padding: '10px'}}>Description</th>
            </tr>
          </thead>
          <tbody>

            {meetings.slice(currentPage * 10, currentPage * 10 + 10).map((meeting) => (

              <tr key={meeting.meeting_id}>
                <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{meeting.meeting_id}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.address}</td>
                {/* <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.time}</td> */}
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{new Date(meeting.time).toLocaleString('en-US')}</td>

                {/* <td style={{ border: '1px solid #ccc', padding: '5px' }}>{new Date(meeting.time).toLocaleString('en-US', { timeZone: 'UTC' })}</td> */}

                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{meeting.summary}</td>

              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {Array.from(Array(totalPages)).map((_, i) => (
            <a
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                display: "inline-block",
                backgroundColor: currentPage === i ? "blue" : "white",
                color: currentPage === i ? "white" : "black",
                border: "1px solid black",
                padding: "1px 5px",
                margin: "5px",
                cursor: "pointer"
              }}
            >
              {i  + 1}
            </a>
          ))}
        </div>
        <div></div>
      </div>
      </div>
      </div>

      <div className="guest-right-section" style={{ flex: 1, height: '100vh' }}>
  
  <div style={{
    backgroundImage: `url(${bgImage})`,
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }} />
</div>

</div>
  
</div>
  );
};

export default UnregisteredHome;
