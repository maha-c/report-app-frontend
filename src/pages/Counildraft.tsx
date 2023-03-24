
    import { useState, useEffect, SetStateAction } from 'react';
    import { getAllComplaints, Complaint, getMeetings, Meeting, User, getUsers } from '../api/requests';
    import '../components/styles.css';
    import { MeetingDetails } from '../components/meeting-details';
    import { ComplaintDetails } from '../components/compliant-details';
    import CreateMeeting from '../components/createMeeting';
    import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
    import { UserDetails } from '../components/user-details';
    import CreateUser from '../components/createUser';


    const complaintsPerPage = 5;
    const meetingsPerPage = 5;

    type ComplaintsTableProps = {
        complaints: Complaint[];
        onAction: {
            handleRefresh: () => void;
        };
    };

    // export function ComplaintsTable({ complaints }: { complaints: Complaint[] }) {

    function ComplaintsTable({ complaints, onAction }: ComplaintsTableProps) {

        const [currentPage, setCurrentPage] = useState(0);


        //const totalPages = Math.ceil(complaints.length / complaintsPerPage);
        const startIndex = (currentPage - 1) * complaintsPerPage;
        const endIndex = startIndex + complaintsPerPage;

        const currentPageData = complaints.slice(startIndex, endIndex);
        const [selectedComplaintId, setselectedComplaintId] = useState(0);

        const [searchQuery, setSearchQuery] = useState('');

        const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0); // reset current page to 0 when search query changes
        };

        const filteredComplaints = complaints.filter(
            (complaint) =>
                complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.meeting_id.toString().includes(searchQuery) ||
                complaint.complaint_id.toString().toLowerCase().includes(searchQuery.toLowerCase())

        );
        const totalPages = searchQuery ? Math.ceil(filteredComplaints.length / 5) : Math.ceil(complaints.length / 5);


        return (
            <>

                <div>
                    <label> Filter By</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Type description or status..."
                    />
                    <p> </p>
                </div>

                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>ID</th>
                            <th style={{ border: '1px solid black' }}>DESCRIPTION</th>
                            <th style={{ border: '1px solid black' }}>MEETING ID</th>
                            <th style={{ border: '1px solid black' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.slice(currentPage * 5, currentPage * 5 + 5).map((complaint) => (
                            <tr key={complaint.complaint_id}>
                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                    <a href="#" onClick={() => setselectedComplaintId(complaint.complaint_id)}>{complaint.complaint_id}</a>
                                </td>
                                <td style={{ border: '1px solid black' }}>{complaint.description}</td>
                                <td style={{ border: '1px solid black' }}>{complaint.meeting_id}</td>
                                <td style={{ border: '1px solid black' }}>{complaint.status}</td>
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

                <div>
                    {selectedComplaintId !== 0 && <ComplaintDetails selectedComplaintId={selectedComplaintId} onAction={onAction} />}
                </div>
            </>
        );
    }

    type MeetingsTableProps = {
        meetings: Meeting[];
        onAction: {
            handleRefresh: () => void;
        };
    };

    // function MeetingsTable({ meetings }: { meetings: Meeting[] }, onAction : {handleRefresh: any}) {
    function MeetingsTable({ meetings, onAction }: MeetingsTableProps) {
        const [currentPage, setCurrentPage] = useState(0);


        //const totalPages = Math.ceil(meetings.length / meetingsPerPage);
        const startIndex = (currentPage - 1) * meetingsPerPage;
        const endIndex = startIndex + meetingsPerPage;

        const currentPageData = meetings.slice(startIndex, endIndex);
        const [selectedMeetingId, setselectedMeetingId] = useState(0);

        const [searchQuery, setSearchQuery] = useState('');

        const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0); // reset current page to 0 when search query changes
        };

        const filteredMeetings = meetings.filter(
            (meeting) =>
                meeting.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.meeting_id.toString().includes(searchQuery) ||
                meeting.time.toString().toLowerCase().includes(searchQuery.toLowerCase())

        );
        const totalPages = searchQuery ? Math.ceil(filteredMeetings.length / 5) : Math.ceil(meetings.length / 5);

        return (
            <>

                <div>
                    <label> Filter By</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Type address or summary..."
                    />
                    <p> </p>
                </div>

                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>ID</th>
                            <th style={{ border: '1px solid black' }}>ADDRESS</th>
                            <th style={{ border: '1px solid black' }}>DATE/TIME</th>
                            <th style={{ border: '1px solid black' }}>SUMMARY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMeetings
                            .slice(currentPage * 5, currentPage * 5 + 5)
                            .map((meeting) => (
                                <tr key={meeting.meeting_id}>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        <a href="#" onClick={() => setselectedMeetingId(meeting.meeting_id)}>
                                            {meeting.meeting_id}
                                        </a>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>{meeting.address}</td>
                                    <td style={{ border: '1px solid black' }}>
                                        {new Date(meeting.time).toLocaleString('en-US', { timeZone: 'UTC' })}
                                    </td>
                                    <td style={{ border: '1px solid black' }}>{meeting.summary}</td>
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
                <div>
                    {selectedMeetingId !== 0 && <MeetingDetails
                        selectedMeetingId={selectedMeetingId} onAction={onAction} />}

                </div>
            </>
        );
    }

    //Users Tab
    type UsersTableProps = {
        Users: User[];
        onAction: {
            handleRefresh: () => void;
        };
    };
    const UsersPerPage = 5

    // function UsersTable({ Users }: { Users: User[] }, onAction : {handleRefresh: any}) {
    function UsersTable({ Users, onAction }: UsersTableProps) {
        const [currentPage, setCurrentPage] = useState(0);


        //const totalPages = Math.ceil(Users.length / UsersPerPage);
        const startIndex = (currentPage - 1) * UsersPerPage;
        const endIndex = startIndex + UsersPerPage;

        const currentPageData = Users.slice(startIndex, endIndex);
        const [selectedUserId, setselectedUserId] = useState(0);

        const [searchQuery, setSearchQuery] = useState('');

        const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0); // reset current page to 0 when search query changes
        };

        const maskText = (text : string) => {
            return '*'.repeat(text.length)
        }

        const filteredUsers = Users.filter(
            (User) =>
                User.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                User.user_id.toString().includes(searchQuery) ||
                User.role.toLowerCase().includes(searchQuery.toLowerCase())

        );
        const totalPages = searchQuery ? Math.ceil(filteredUsers.length / 5) : Math.ceil(Users.length / 5);

        return (
            <>

                <div>
                    <label> Filter By</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Type userName or Id..."
                    />
                    <p> </p>
                </div>

                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>ID</th>
                            <th style={{ border: '1px solid black' }}>USERNAME</th>
                            <th style={{ border: '1px solid black' }}>PASSWORD</th>
                            <th style={{ border: '1px solid black' }}>ROLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers
                            .slice(currentPage * 5, currentPage * 5 + 5)
                            .map((User) => (
                                <tr key={User.user_id}>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        <a href="#" onClick={() => setselectedUserId(User.user_id)}>
                                            {User.user_id}
                                        </a>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>{User.userName}</td>
                                    <td style={{ border: '1px solid black' }}>
                                        {maskText(User.password)}
                                    </td>
                                    <td style={{ border: '1px solid black' }}>{User.role}</td>
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
                <div>
                    {selectedUserId !== 0 && <UserDetails
                        selectedUserId={selectedUserId} onAction={onAction} />}

                </div>
            </>
        );
    }


    //###################end of Users#####################
    type DashboardProps = {
        onLogout: () => void;
        user: any;
    };
    export let complaints: Complaint[] = [];

    export const Dashboardold = ({ onLogout, user }: DashboardProps) => {

        // function Dashboard()

        const [complaints, setComplaints] = useState<Complaint[]>([]);
        const [meetings, setMeetings] = useState<Meeting[]>([]);
        const [users, setUsers] = useState<User[]>([]);
        const [renderCreateMeeting, setrenderCreateMeeting] = useState(Boolean)

        useState(() => {
            (async () => {
                const meetings = await getMeetings();
                setMeetings(meetings);
            })();
        });

        const handleRefresh = async () => {
            const getmeetingdata = await getMeetings();
            setMeetings(getmeetingdata);
            const getcomplaintdata = await getAllComplaints();
            setComplaints(getcomplaintdata);
            const getuserdata = await getUsers();
            setUsers(getuserdata);
        };

        useState(() => {
            (async () => {
                const complaints = await getAllComplaints();
                setComplaints(complaints);
            })();
        });

        useState(() => {
            (async () => {
                const users = await getUsers();
                setUsers(users);
            })();
        });

        return (
            <div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontFamily: 'Open Sans', fontSize: '18px'
                }}>
                    <h2>Welcome {user.userName} ({user.role})</h2>
                    <button onClick={onLogout}>Logout</button>

                </div>
                <div>
                    <Tabs>
                        <TabList className="tab-menu">
                            <Tab className="tab-menu-item">Complaints ({complaints.length})</Tab>
                            <Tab className="tab-menu-item">Meetings ({meetings.length})</Tab>
                            <Tab className="tab-menu-item">Users ({users.length})</Tab>
                        </TabList>

                        <TabPanel>
                            <p></p>
                            <ComplaintsTable complaints={complaints} onAction={{ handleRefresh }} />

                        </TabPanel>

                        <TabPanel>
                            <p></p>
                            <MeetingsTable meetings={meetings} onAction={{ handleRefresh }} />
                            <button onClick={() => setrenderCreateMeeting(true)}>Click here to Create Meeting</button>
                            {renderCreateMeeting && <CreateMeeting onAction={{ handleRefresh }} />}
                        </TabPanel>

                        <TabPanel>
                            <p></p>
                            <UsersTable Users={users} onAction={{ handleRefresh }} />
                            <button onClick={() => setrenderCreateMeeting(true)}>Click here to Create User</button>
                            {renderCreateMeeting && <CreateUser onAction={{ handleRefresh }} />}
                        </TabPanel>
                    </Tabs>
                </div>

            </div>

        );
    }

    export default Dashboardold;

