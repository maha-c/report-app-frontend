  import { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
  import { Login, userAuthentication } from '../api/requests';

  interface SignInProps {
    onLogin: (role: 'Constituent' | 'Council' | 'Unregistered User', user: any) => void;
  }

  export function SignIn(props: SignInProps) {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [newLogin, setNewLogin] = useState<Login>({ userName: "", password: "" });
    
      useEffect(() => {
        setNewLogin({ userName: username, password: password });
      }, [username, password]);
    
      const handleSignIn = async () => {
        try {
          const response = await userAuthentication(newLogin);
          if (response) {
            // handle success response here
            console.log(response);
            localStorage.setItem("user", JSON.stringify(response)); // store response in local storage
            props.onLogin(response.role as "Constituent" | "Council", response);
          } else {
            setError("Invalid login");
          }
        } catch (error) {
          setError("Invalid login credentials");
        }
      };
      
        const handleGuestLogin = () => {
          const user = { userName: 'Guest', role: 'Unregistered User' }; // sample user object
          props.onLogin('Unregistered User', user);
        };
        
      
      return <>


<div className="sign-container">
  <div className="left-section">
    <img src="/src/images/city.jpeg" alt="City" />
  </div>
  <div className="right-section">
  <div style={{ display: 'flex',  fontFamily: 'Open Sans', fontSize: '18px',flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
    <div style={{ textAlign: 'center'}}>
      <h1>Welcome to Attleboro City Council</h1> </div>
   
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid #ccc', padding: '1rem', borderRadius: '0.25rem' }} onSubmit={(e) => e.preventDefault()} >
      <label style={{ marginBottom: '0.5rem', fontFamily: 'Open Sans', fontSize: '18px' }}>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ marginLeft: '0.5rem' }} />
      </label>
      <label style={{ marginBottom: '0.5rem' , fontFamily: 'Open Sans', fontSize: '18px'}}>
        Password: 
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginLeft: '0.5rem' }} />
      </label>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <button onClick={handleSignIn} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>Sign In</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <a href="#" onClick={handleGuestLogin} style={{ marginTop: '0.5rem', fontSize: '0.875rem', textDecoration: 'none', color: '#007bff', cursor: 'pointer' }}>Continue as Guest</a>
      </div>
    </div>
    {error && <p className="error" style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}
    <div style={{ height: '1rem' }}></div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
  <a href="#">Copyright &copy; 2023 Attleboro City Council</a>
  <div style={{ height: '1rem' }}></div>
  <div style={{ height: '5rem', textAlign: 'center' }}>
  <a href="#">Contact Us</a>
  </div>
  
</div>

  
</div>

  </div>
  
  </div>
  
</div>

    
</>
 };
