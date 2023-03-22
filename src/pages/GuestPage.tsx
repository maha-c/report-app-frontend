import React, { useState } from 'react';
import { createComplaint, ComplaintForm, Complaint } from '../api/requests';


type GuestProps = {
  onLogout: () => void;
  user: any
};

  const GuestPage = ({ onLogout}: GuestProps) => {

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
  
  return (
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc', padding: '20px' }}>
        
     <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
      >
        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" value={complaintForm.description} onChange={handleInputChange} rows={10} cols={50}></textarea>

        </div>
        <button type="submit">Add Complaint</button>
      </form>

      {newComplaintId && (
      <p>New complaint created with ID: {newComplaintId}</p>
    )}
    <button onClick={onLogout}>Click here to Login</button>

</div>

  );
            }

export default GuestPage;
