import { useEffect, useState } from "react";
import { MeetingForm, createMeeting, getMeetings, Meeting } from "../api/requests";
import { MeetingDetails } from "./meeting-details";
import { useQuery, useQueryClient } from "react-query";


type CreateMeetingProps = {
  onAction: {
    handleRefresh: () => void;
  };
}

export function CreateMeeting({ onAction }: CreateMeetingProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newMeeting, setNewMeeting] = useState<MeetingForm>({
    address: "",
    time: 0,
    summary: ""
  });

  const [isCreated, setIsCreated] = useState(false);
  const [newMeetingId, setNewMeetingId] = useState<number | null>(null);
  const [showform, setshowform] = useState(true);


  const handleCreateMeeting = async () => {
    console.log("new in -->  " +newMeeting.time)
    const createdMeeting = await createMeeting(newMeeting);
    console.log("new out ad-->  " + createdMeeting.address)
    console.log("new out aTomed-->  " + createdMeeting.time)
    console.log("new out id-->  " + createdMeeting.meeting_id)
    console.log("new out su-->  " + createdMeeting.summary)
    onAction.handleRefresh()
    setNewMeetingId(createdMeeting.meeting_id);
    setIsCreated(true)
    setshowform(false)
    setMeetings([...meetings, createdMeeting]);
    setNewMeeting({
      address: "",
      time: 0,
      summary: ""
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCreated) {
      timer = setTimeout(() => {

        setIsCreated(false);
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isCreated]);

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

 
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const dateTime = new Date(value).getTime();
    setNewMeeting(prevMeeting => ({
      ...prevMeeting,
      [name]: dateTime,
    }));
  };
  

  useState(() => {
    (async () => {
      const meetings = await getMeetings();
      setMeetings(meetings);
    })();
  });


  return (
    <div>

      {!isCreated && (<div>
        <label>Address:</label>

        <input type="text" name="address" value={newMeeting.address} onChange={handleNewMeetingChange} />
        <label>Time:</label>

        <input
          type="datetime-local"
          name="time"
          value={newMeeting.time
            ? new Date(newMeeting.time).toISOString().slice(0, -8)
            : ''}
          onChange={handleTimeChange}
        />

        <label>Summary:</label>
        <input type="text" name="summary" value={newMeeting.summary} onChange={handleNewMeetingChange} />
        <div>
          <button onClick={handleCreateMeeting}>Create Meeting</button>
        </div>
      </div>
      )}

      {isCreated && (
        <p>New Meeting created with ID: {newMeetingId}</p>
      )}


    </div>
  )
}

export default CreateMeeting;
