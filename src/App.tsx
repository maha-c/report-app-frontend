import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UnregisteredHome from './pages/UnregisteredHome';
import Dashboard from './pages/Counildraft';
import {SignIn} from './pages/signinPage';
import { MeetingsPage } from './components/meeting'

export const queryClient = new QueryClient();

const App = () => {
  const [userRole, setUserRole] = useState<"Constituent" | "Council"  | "Unregistered User"| null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const { role, userDetails } = JSON.parse(storedUserDetails);
      setUserRole(role);
      setUser(userDetails);
    }
  }, []); // load user details from local storage on initial render only

  const handleLogin = (role: "Constituent" | "Council" | "Unregistered User", userDetails: any) => {
    setUserRole(role);
    setUser(userDetails);

    const userDetailsToStore = {
      role,
      userDetails,
    };
    localStorage.setItem('userDetails', JSON.stringify(userDetailsToStore)); // store user details in local storage
  };

  const handleLogout = () => {
    localStorage.removeItem('userDetails'); // remove user details from local storage on logout
    setUserRole(null);
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
       <BrowserRouter>
        <Routes>
         
          <Route path="/meeting" element={<MeetingsPage />} />
  
        </Routes>
      </BrowserRouter>  

      {userRole === null && <SignIn onLogin={(role: "Constituent" | "Council"| "Unregistered User", userDetails: any) => handleLogin(role, userDetails)} />}
      {/* {userRole === "Unregistered User" && <GuestPage onLogout={handleLogout} user={undefined}/>} */}
      {userRole === "Unregistered User" && <UnregisteredHome onLogout={handleLogout} user={user}/>}
      {userRole === "Constituent" && <UnregisteredHome user={user}  onLogout={handleLogout} />}
      {userRole === "Council" && <Dashboard user={user} onLogout={handleLogout} />}
    </QueryClientProvider>
  );
};

export default App;
