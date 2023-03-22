
export type Complaint = {
    complaint_id: number,
    description: string,
    status: string,
    meeting_id: number
}

export type ComplaintForm = {
    description: string,
    status: string,
    meeting_id: number
    
}

export type User = {
    userName: string,
    password: string,
    role:  string,    
    user_id: number
}

export enum UserRole {
  Constituent = 'Constituent',
  Council = 'Council',
  UnRegistered = 'UnRegistered'
}

export enum ComplaintStatus {
  UNREVIEWED = 'UN-REVIEWED',
  REVIEWED = 'REVIEWED',
  HIGHPRIORITY = 'HIGH PRIORITY',
  LOWPRIORITY = 'LOW PRIORITY',
  IGNORED = 'IGNORED'

}

  
export type Meeting = {
    meeting_id: number,
    address: string,
    time: number,
    summary: string
}
export type MeetingForm = {
    address: string,
    time: number,
    summary: string
}

export type Login = {
  
    userName: string;
    password: string;
  
}

export type UserForm = {
  
  userName: string;
  password: string;
  
  role: string

}
export const url = "http://127.0.0.1:8080";

export async function getAllComplaintsoo():Promise<Complaint[]> {
    const response = await (await (fetch(`${url}/Complaints`))).json()
    return response;
}

export async function getAllComplaints(): Promise<Complaint[]> {
  const response = await fetch(`${url}/complaints`);
  const complaints: Complaint[] = await response.json();
  console.log(`Meetings data: ${JSON.stringify(complaints)}`);
  return complaints;
}

export async function getComplaintById(complaintId: number):Promise<Complaint> {
    const response = await (await (fetch(`${url}/complaints/` + complaintId))).json()
    return response;
}
export async function getComplaintsByStatus(status: string):Promise<Complaint[]> {
    const response = await (await (fetch(`${url}/compalints/status` + status))).json()
    return response;
}

export async function createComplaint(newComplaint: ComplaintForm):Promise<Complaint> {
    const response = await (await (fetch(`${url}/complaints`,{
        method: "POST",
        body:JSON.stringify(newComplaint),
        headers: {
            "Content-Type":"application/json"
        }
    }))).json();
    return response;
}

export async function updateComplaint(comp: Complaint):Promise<Complaint> {
    const response = await fetch(`${url}/complaints`,{
        method: "PUT",
        body:JSON.stringify(comp),
        headers: {
            "Content-Type":"application/json"
        }
    })
    const complaint: Complaint = await response.json()
    console.log(`Complaint data: ${JSON.stringify(complaint)}`);
    return complaint;
}

export async function deleteComplaint(id: number): Promise<any> {
    const response = await fetch(`${url}/complaints/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to delete complaint');
    }
  }

  export async function createMeeting(newMeeting: MeetingForm): Promise<Meeting> {
    const response = await fetch(`${url}/meetings`, {
      method: "POST",
      body: JSON.stringify(newMeeting),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const meeting: Meeting = await response.json();
    console.log(`Meeting data: ${JSON.stringify(meeting)}`);
    return meeting;
  }
  

  export async function getMeetings(): Promise<Meeting[]> {
    const response = await fetch(`${url}/meetings`);
    const meetings: Meeting[] = await response.json();
    console.log(`Meetings data: ${JSON.stringify(meetings)}`);
    return meetings;
  }

    
  export async function updateMeeting(updatedMeeting: Meeting): Promise<Meeting> {
    const response = await fetch(`${url}/meetings`, {
      method: "PUT",
      body: JSON.stringify(updatedMeeting),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const meeting: Meeting = await response.json();
    console.log(`Meeting data: ${JSON.stringify(meeting)}`);
    return meeting;
  }
  
  
  export async function deleteMeetingbyId(id: number): Promise<boolean> {
    const response = await fetch(`${url}/meetings/${id}`, {
      method: "DELETE"
    });
    return response.ok;
  }

  export async function getMeetingById(id: number): Promise<Meeting> {
    const response = await fetch(`${url}/meetings/${id}`);
    if (response.ok) {
      const meeting = await response.json();
      return meeting;
    } else {
      throw new Error(`Failed to retrieve meeting with ID ${id}: ${response.statusText}`);
    }
  }
  
  export async function userAuthentication(login: Login): Promise<UserForm> {
    
    const response = await fetch(`${url}/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(login)
    });

   
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to authenticate user: ${error}`);
    } 
    
    const user = await response.json();
    console.log(" Login success and i am in " + login.userName )
    return user;
  }

  //User API's 
  export async function createUser(newUser: UserForm): Promise<User> {
    const response = await fetch(`${url}/users`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const user: User = await response.json();
    console.log(`User data: ${JSON.stringify(user)}`);
    return user;
  }

  export async function updateUser(updatedUser: UserForm): Promise<User> {
    const response = await fetch(`${url}/users`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const user: User = await response.json();
    console.log(`User data: ${JSON.stringify(user)}`);
    return user;
  }

  export async function deleteUser(userId: number): Promise<boolean> {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "DELETE"
    });
    console.log(`User with ID ${userId} has been deleted.`);
    return response.ok;
  }

  export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${url}/users`);
    const users: User[] = await response.json();
    console.log(`Users data: ${JSON.stringify(users)}`);
    return users;
  }
  
  export async function getUserById(userId: number): Promise<User> {
    const response = await fetch(`${url}/users/${userId}`);
    const user: User = await response.json();
    console.log(`User data: ${JSON.stringify(user)}`);
    return user;
  }
  
  
  
  
  
  
  

  


