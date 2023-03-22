import { useEffect, useState } from "react";
import { UserForm, createUser, getUsers, User, UserRole } from "../api/requests";


type CreateUserProps = {
    onAction: {
        handleRefresh: () => void;
    };
}

export function CreateUser({ onAction }: CreateUserProps) {
    const [Users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<UserForm>({
        userName: "",
        role: "",
        password: "",
    });

    const [isCreated, setIsCreated] = useState(false);
    const [newUserId, setNewUserId] = useState<number | null>(null);
    const [showform, setshowform] = useState(true);


    const handleCreateUser = async () => {
        console.log("user info" + newUser)
        const createdUser = await createUser(newUser);
        //onAction.handleRefresh()
        setNewUserId(createdUser.user_id);
        setIsCreated(true)
        setshowform(false)
        setUsers([...Users, createdUser]);
        setNewUser({
            userName: "",
            role: "",
            password: ""
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

    const handleNewUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Update time property if name is 'time'
        const newValue = name === 'time' ? new Date(value).getTime() : value;

        // Update state
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: newValue
        }));
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewUser(prevUser => ({
            ...prevUser,
            [name]: value,
        }));
    };


    useState(() => {
        (async () => {
            const Users = await getUsers();
            setUsers(Users);
        })();
    });


    return (
        <div>

            {!isCreated && (<div>
                <label>Username:</label>

                <input type="text" name="userName" value={newUser.userName} onChange={handleNewUserChange} />
                <label>Password:</label>

                <input type="text" name="password" value={newUser.password} onChange={handleNewUserChange} />

                <label>
                    Role:
                    <select name="role" value={newUser.role} onChange={handleRoleChange}>
                        {Object.values(UserRole).map((UserRole) => (
                            <option key={UserRole} value={UserRole}>
                                {UserRole}
                            </option>
                        ))}
                    </select>
                </label>

                <div>
                    <button onClick={handleCreateUser}>Create User</button>
                </div>
            </div>
            )}

            {isCreated && (
                <p>New Meeeting created with ID: {newUserId}</p>
            )}


        </div>
    )
}

export default CreateUser;
