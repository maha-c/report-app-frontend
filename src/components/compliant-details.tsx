  import { useQuery } from "react-query";
  import { useState, useEffect } from "react";
  import { queryClient } from "../App";

  import { getComplaintById, Complaint, deleteComplaint, updateComplaint, ComplaintStatus, getMeetings } from "../api/requests";



  type ComplaintDetailsProps = {
    selectedComplaintId: number;
    onAction: {
      handleRefresh: () => void;
    };
  }

  export function ComplaintDetails({ selectedComplaintId, onAction }: ComplaintDetailsProps) {
    //const queryClient = useQueryClient();


    const { isLoading, isError, data } = useQuery(
      ["Complaints", selectedComplaintId],
      () => getComplaintById(selectedComplaintId)
    );

    const [isUpdated, setIsUpdated] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isselectedComplaintId, setIsselectedComplaintId] = useState(null);

    const [complaint, setcomplaint] = useState<Complaint>({
      complaint_id: 0,
      description: '',
      status: '',
      meeting_id: -1
    });

    useEffect(() => {
      if (data) {
        setcomplaint(data);
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

    function handleSubmit1(event: { preventDefault: () => void; }) {


      const updatedComplaint: Complaint = {
        complaint_id: selectedComplaintId,
        description: complaint.description,
        status: complaint.status,
        meeting_id: complaint.meeting_id
      };
      event.preventDefault();
      setcomplaint(updatedComplaint); // Update meeting state with new form values
      updateComplaint(updatedComplaint).then(() => {
        console.log("Complaint updated");
        setIsUpdated(true);
        queryClient.invalidateQueries("Complaints");

      });
    }

    const handleUpdateComplaint = async () => {

      // Get the updated Complaint information from the form's inputs
      const updatedComplaint: Complaint = {
        complaint_id: selectedComplaintId,
        description: complaint.description,
        status: complaint.status,
        meeting_id: complaint.meeting_id
      };
      setcomplaint(updatedComplaint); // Update meeting state with new form values

      // Call updateComplaint API and update state if successful
      const updated = await updateComplaint(updatedComplaint);

      if (updated) {
        setcomplaint(updatedComplaint);
        setIsUpdated(true);
        onAction.handleRefresh()
        queryClient.invalidateQueries("Complaints");

      }

    };


    const handleDeleteComplaint = async () => {
      const confirmed = window.confirm(`Are you sure you want to delete Complaint with ID ${selectedComplaintId}?`);
      if (confirmed) {
        const deleted = await deleteComplaint(selectedComplaintId);

        if (deleted) {
          setcomplaint({

            complaint_id: 0,
            description: '',
            status: '',
            meeting_id: 0
          });
          setIsUpdated(false);
          setIsDeleted(true);
          onAction.handleRefresh()
          queryClient.invalidateQueries("Complaints");

        }
      }
    };


    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setcomplaint(prevComplaint => ({
        ...prevComplaint,
        [name]: value,
      }));
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      setcomplaint(prevComplaint => ({
        ...prevComplaint,
        [name]: value,
      }));
    };

    const handleMeetingIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      setcomplaint(prevComplaint => ({
        ...prevComplaint,
        [name]: value,
      }));
    };

    const [meetingIds, setMeetingIds] = useState<number[]>([]);

    useEffect(() => {
      (async () => {
        const meetings = await getMeetings();
        const ids = meetings.map((meeting) => meeting.meeting_id);
        setMeetingIds(ids);
      })();
    }, []);

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (isError) {
      return <p>Error fetching Complaint details.</p>;
    }



    return (

      <div>
        <h3><u>Complaint Details</u></h3>
        <form onSubmit={handleSubmit1}>
          <label>
            ID:
            <input type="text" value={complaint.complaint_id} name="Complaint_id" readOnly />
          </label>
          <label>
            Description:
            <input type="text" value={complaint.description} name="description" onChange={handleDescriptionChange} />
          </label>
          {/* <label>
        Status:
        <input type="text" value={Complaint.status} onChange={handleStatusChange} />
      </label> */}

          <label>
            Status:
            <select name="status" value={complaint.status} onChange={handleStatusChange}>
              {Object.values(ComplaintStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Meeting Id:
            <select name="meeting_id" value={complaint.meeting_id} onChange={handleMeetingIdChange}>
              <option value="">Select a meeting ID</option>
              {meetingIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <div>
            <button onClick={handleUpdateComplaint}>Update Complaint</button>
            <button onClick={handleDeleteComplaint}>Delete Complaint</button>
          </div>
        </form>

        {isUpdated && <p>Complaint updated successfully</p>}
        {isDeleted && <p>Complaint deleted successfully</p>}
      </div>


    );
  }
