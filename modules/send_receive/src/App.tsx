import { useEffect, useState } from 'react';
import './App.css';

interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>desk_pipe</h1>

      {user ? (
        <div className="card">
          <p>Welcome, {user.name}!</p>
          {user.image && <img src={user.image} alt="profile" width={50} height={50} />}
          <p>Email: {user.email}</p>
          <a href="/api/auth/signout">
            <button>Log out</button>
          </a>
        </div>
      ) : (
        <div className="card">
          <p>You are not logged in.</p>
          <a href="/api/auth/signin/github">
            <button>Log in with GitHub</button>
          </a>
          <a href="/api/auth/signin/google">
            <button>Log in with Google</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;