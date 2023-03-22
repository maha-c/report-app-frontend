import { useState } from "react";
import { Meeting } from "../api/requests";
import { Complaint } from "../components/complaints"

type ComplaintForm = {
  description: string;
};

type ReviewComplaintsProps = {
  onLogout: () => void;
};

const ReviewComplaints = ({ complaints, onLogout }: { complaints: Complaint[], onLogout: () => void }) => {

  return (
    <div>
      <h2>Review Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>{complaint.form.description}</li>
        ))}
      </ul>
      <button onClick={onLogout}>Logout</button>
    </div>


  );
};

const CreateMeetings = ({
  onMeetingCreate,
}: {
  onMeetingCreate: (meeting: Meeting) => void;
}) => {
  const [title, setTitle] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Create Meetings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
};

const AttachComplaintsToMeetings = ({
  complaints,
  meetings,
  onComplaintAttach,
}: {
  complaints: Complaint[];
  meetings: Meeting[];
  onComplaintAttach: (meetingId: number, complaintId: number) => void;
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState(-1);
  const [selectedMeeting, setSelectedMeeting] = useState(-1);

  const handleComplaintSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedComplaint(parseInt(e.target.value));
  };

  const handleMeetingSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMeeting(parseInt(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    onComplaintAttach(selectedMeeting, selectedComplaint);
    setSelectedComplaint(-1);
    setSelectedMeeting(-1);
  };

  return (
    <div>
      <h2>Attach Complaints to Meetings</h2>
      <div onSubmit={handleSubmit}>
        <div>
          <label htmlFor="complaint">Complaint:</label>
          <select id="complaint" onChange={handleComplaintSelect}>
            <option value={-1}>Select a complaint</option>
            {complaints.map((complaint) => (
              <option key={complaint.id} value={complaint.id}>
                {complaint.form.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="meeting">Meeting:</label>
          <select id="meeting" onChange={handleMeetingSelect}>
            <option value={-1}>Select a meeting</option>
            {meetings.map((meeting) => (
              <option key={meeting.meeting_id} value={meeting.meeting_id}>
                {meeting.summary}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Attach Complaint</button>
      </div>


    </div>
  );
};

export default ReviewComplaints