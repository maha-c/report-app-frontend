import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { queryClient } from "../App";

import { getMeetingById, Meeting, deleteMeetingbyId, updateMeeting } from "../api/requests";



type MeetingDetailsProps = {
  selectedMeetingId: number;
  onAction: {
    handleRefresh: () => void;
  };
}


export function MeetingDetails({ selectedMeetingId, onAction }: MeetingDetailsProps) {



  const { isLoading, isError, data } = useQuery(
    ["meetings", selectedMeetingId],
    () => getMeetingById(selectedMeetingId)

  );

  useEffect(() => {
    if (selectedMeetingId != 0) {
      setviewmeetingdetails(true);
    }
  }, [data]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [viewmeetingdetails, setviewmeetingdetails] = useState(true);

  const [meeting, setMeeting] = useState<Meeting>({
    meeting_id: 0,
    address: "",
    time: 0,
    summary: ""
  });

  useEffect(() => {
    if (data) {
      setMeeting(data as Meeting);
    }
  }, [data]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isUpdated || isDeleted) {
      timer = setTimeout(() => {
        setIsUpdated(false);
        setIsDeleted(false);
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isUpdated, isDeleted]);

  function handleSubmit2(event: { preventDefault: () => void; }) {
    const updatedMeeting: Meeting = {
      meeting_id: selectedMeetingId,
      address: meeting.address,
      time: new Date(meeting.time).getTime(),
      summary: meeting.summary
    };
    event.preventDefault();
    updateMeeting(updatedMeeting).then(() => {
      console.log("Meeting updated");
      setIsUpdated(true);
      queryClient.invalidateQueries("meetings");

    });
  }

  function handleSubmit1(event: { preventDefault: () => void; }) {
    const updatedMeeting: Meeting = {
      meeting_id: selectedMeetingId,
      address: meeting.address,
      time: new Date(meeting.time).getTime(),
      summary: meeting.summary
    };

    event.preventDefault();
    setMeeting(updatedMeeting); // Update meeting state with new form values
    updateMeeting(updatedMeeting).then(() => {
      console.log("Meeting updated");
      setIsUpdated(true);
      onAction.handleRefresh()
      // selectedMeetingId = 0
      setviewmeetingdetails(false)
      queryClient.invalidateQueries("meetings");
    });
  }




  const handleUpdateMeeting = async () => {
    // Get the updated meeting information from the form's inputs
    const updatedMeeting: Meeting = {
      meeting_id: selectedMeetingId,
      address: meeting.address,
      time: new Date(meeting.time).getTime(),
      summary: meeting.summary
    };

    // Call updateMeeting API and update state if successful
    const updated = await updateMeeting(updatedMeeting);

    if (updated) {
      setMeeting(updatedMeeting);
      setIsUpdated(true);
      onAction.handleRefresh()
      //onUpdate(updatedMeeting)
      setviewmeetingdetails(false)
      queryClient.invalidateQueries("meetings");

    }
  };


  const handleDeleteMeeting = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete Meeting with ID ${selectedMeetingId}?`);
    if (confirmed) {
      const deleted = await deleteMeetingbyId(selectedMeetingId);

      if (deleted) {
        setMeeting({
          meeting_id: 0,
          address: "",
          time: 0,
          summary: ""
        });
        setIsDeleted(true);
        setIsUpdated(false)
        //onDelete(meetingC)
        onAction.handleRefresh()
        setviewmeetingdetails(false)



        queryClient.invalidateQueries("meetings");

      }
    }
  };




  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMeeting(prevMeeting => ({
      ...prevMeeting,
      [name]: value,
    }));
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMeeting(prevMeeting => ({
      ...prevMeeting,
      [name]: value,
    }));
  };

  const handleTimeChangeold = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const dateTime = value + ':00.000Z';
    setMeeting(prevMeeting => ({
      ...prevMeeting,
      [name]: new Date(dateTime).getTime(),
    }));
  };


  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const date = new Date(value);
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const dateTime = new Date(date.getTime() - offsetMs).toISOString();
    setMeeting(prevMeeting => ({
      ...prevMeeting,
      [name]: dateTime,
    }));
  };
  
  
  
  
  


  


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching meeting details.</p>;
  }

  return (
    <div>
      {viewmeetingdetails && (
        <><h3><u>Meeting Details</u></h3><form onSubmit={handleSubmit1}
          // style={{ maxWidth: '400px' , width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } }>
          style={{
            maxWidth: '400px !important',
            width: '100% !important',
            display: 'flex !important',
            alignItems: 'center !important',
            gap: '10px !important',
            backgroundColor: 'white !important'
          }}>
          <label>
            ID:
            <input type="text" value={meeting.meeting_id} name="meeting_id" readOnly />
          </label>
          <label>
            Address:
            <input type="text" value={meeting.address} name="address" onChange={handleAddressChange} />
          </label>
          <label>
            Time:
            <input
              type="datetime-local"
              name="time"

              value={meeting.time
                ? new Date(meeting.time).toISOString().slice(0, -8)
                : ''}
              onChange={handleTimeChange} />
          </label>
          <label>
            Summary:
            <input
              type="text"
              value={meeting.summary}
              name="summary"
              onChange={handleSummaryChange} />
          </label>
          {/* <button type="submit">Save Changes</button> */}
          <div>
            <button onClick={handleUpdateMeeting}>Update Meeting</button>
            <button onClick={handleDeleteMeeting}>Delete Meeting</button>
          </div>

        </form></>
      )}
      {isUpdated && <p>Meeting updated successfully</p>}
      {isDeleted && <p>Meeting deleted successfully</p>}
    </div>


  );
}
