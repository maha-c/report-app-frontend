  import React, { useState } from 'react';

  type ComplaintForm = {
    description: string,
  };

  export type Complaint = {
    id: number,
    form: ComplaintForm,
  };

  const ComplaintsPage = () => {
    const [form, setForm] = useState<ComplaintForm>({ description: '' });
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      setComplaints((prevComplaints) => [...prevComplaints, { id: Date.now(), form: form, },]);
      setForm({
        description: '',
      });
    };

    return (

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc', padding: '20px' }}>

        <div
          onSubmit={handleSubmit}
          style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" value={form.description} onChange={handleInputChange} rows={10} cols={50}></textarea>

          </div>
          <button type="submit">Add Complaint</button>
        </div>

        <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'lightblue' }}>
                <th style={{ border: '1px solid #ccc', padding: '10px', borderColor: 'black' }}>ID</th>
                <th style={{ border: '1px solid #ccc', padding: '10px', borderColor: 'black' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td style={{ border: '1px solid #ccc', padding: '10px', borderColor: 'black' }}>{complaint.id}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', borderColor: 'black' }}>{complaint.form.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a href="/">Home</a>
      </div>

    );

  };

  export default ComplaintsPage;
