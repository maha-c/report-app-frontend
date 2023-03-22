import React, { useState } from 'react';
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

  const [currentPage, setCurrentPage] = useState(0);

  const meetingsPerPage = 5;
  const totalPages = Math.ceil(meetings.length / meetingsPerPage);
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <h3>Welcome {user.userName} ({user.role})</h3>
        <button onClick={onLogout}>Back to SignIn</button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
      >
        <div>
          <label htmlFor="description">Enter the Complaint Description</label>
          <p></p>
          <textarea name="description" value={complaintForm.description} onChange={handleInputChange} rows={5} cols={70}></textarea>
          <button type="submit">Add Complaint</button>
        </div>

      </form>

      {newComplaintId && (
        <p>New complaint created with ID: {newComplaintId}</p>
      )}
      <p>

      </p>

      <label htmlFor="description"><u> Available list of Meetings </u></label>
      <p></p>
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

            {meetings.slice(currentPage * 5, currentPage * 5 + 5).map((meeting) => (

              <tr key={meeting.meeting_id}>
                <td style={{ border: '1px solid #ccc', padding: '3px' }}>{meeting.meeting_id}</td>
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
              {i + 1}
            </a>
          ))}
        </div>
        <div></div>
      </div>
    </div>


  );
};

export default UnregisteredHome;
