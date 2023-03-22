import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { queryClient } from "../App";

import { getUserById, User, deleteUser, updateUser, UserRole } from "../api/requests";



 type UserDetailsProps = {
   selectedUserId: number;
   onAction: {
    handleRefresh: () => void;
  };
 }


export function UserDetails({ selectedUserId, onAction }: UserDetailsProps) {


  
  const { isLoading, isError, data } = useQuery(
    ["Users", selectedUserId],
    () => getUserById(selectedUserId)
    
  );

  useEffect(() => {
    if (selectedUserId != 0) {
      setviewUserdetails(true);
    }}, [data]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [viewUserdetails, setviewUserdetails] = useState(true);

  const [User, setUser] = useState<User>({
    user_id: 0,
    userName: "",
    role: "",
    password: ""
  });

  useEffect(() => {
    if (data) {
      setUser(data as User);
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
  const updatedUser: User = {
    user_id: selectedUserId,
    password: User.password,
    role: User.role,
    userName: User.userName
  };
  
  event.preventDefault();
  setUser(updatedUser); // Update User state with new form values
  updateUser(updatedUser).then(() => {
      console.log("User updated");
      setIsUpdated(true);
      onAction.handleRefresh()
     // selectedUserId = 0
     setviewUserdetails(false)
      queryClient.invalidateQueries("Users");
  });
}




  const handleUpdateUser = async () => {
    // Get the updated User information from the form's inputs

    const updatedUser: User = {
        user_id: selectedUserId,
        password: User.password,
        role: User.role,
        userName: User.userName
      };
  
    // Call updateUser API and update state if successful
    const updated = await updateUser(updatedUser);
  
    if (updated) {
      setUser(updatedUser);
      setIsUpdated(true);
      onAction.handleRefresh()
      //onUpdate(updatedUser)
      setviewUserdetails(false)
      queryClient.invalidateQueries("Users");
      
    }
  };
  
  
  const handleDeleteUser = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete User with ID ${selectedUserId}?`);
    if (confirmed) {
      const deleted = await deleteUser(selectedUserId);

      if (deleted) {
        setUser({
          user_id: 0,
          userName: "",
          password: "",
          role:""
        });
        setIsDeleted(true);
        setIsUpdated(false)
        //onDelete(UserC)
        onAction.handleRefresh()
        setviewUserdetails(false)
        

        
        queryClient.invalidateQueries("Users");
       
      }
    }
  };

  

  
  const handletextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const dateTime = value + ':00.000Z';
    setUser(prevUser => ({
      ...prevUser,
      [name]: new Date(dateTime).getTime(),
    }));
  };
  

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };
  

  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  if (isError) {
    return <p>Error fetching User details.</p>;
  }
  
  return (
    <div>
      {viewUserdetails && (
       <><h3><u>User Details</u></h3><form onSubmit={handleSubmit1}
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
            <input type="text" value={User.user_id} name="User_id" readOnly />
          </label>
          <label>
            UserName:
            <input type="text" value={User.userName} name="userName" onChange={handletextChange} />
          </label>

          <label>
            Password:
            <input type="text" value={User.password} name="password" onChange={handletextChange} />
          </label>
           
          <label>
        Role:
        <select name="role" value={User.role} onChange={handleRoleChange}>
            {Object.values(UserRole).map((UserRole) => (
            <option key={UserRole} value={UserRole}>
                {UserRole}
            </option>
            ))}
        </select>
        </label>
           
          {/* <button type="submit">Save Changes</button> */}
          <div>
            <button onClick={handleUpdateUser}>Update User</button>
            <button onClick={handleDeleteUser}>Delete User</button>
          </div>

        </form></>
          )}
{isUpdated && <p>User updated successfully</p>}
            {isDeleted && <p>User deleted successfully</p>}
  </div>


);
}
