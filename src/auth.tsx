import axios from 'axios';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'local' | 'buyer' | null;
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  subscriptionActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Auth UI component for login/register
import React from 'react';

export const AuthUI: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'local' | 'buyer'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        const res = await axios.post('http://localhost:4000/api/auth/register', {
          name,
          email,
          password,
          role,
        });
        const data = res.data as { user: User };
        login(data.user);
      } else {
        const res = await axios.post('http://localhost:4000/api/auth/login', {
          email,
          password,
        });
        const data = res.data as { user: User };
        login(data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ marginBottom: 24, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
        <b>Signed in as:</b> {user.name} ({user.role})
        {user.role === 'local' && (
          <>
            <br />Verified: {user.isVerified ? 'Yes' : 'No'}
            <br />Subscription: {user.subscriptionActive ? 'Active' : 'Inactive'}
          </>
        )}
        <br />
        <button onClick={logout}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleAuth} style={{ marginBottom: 24, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
      <b>{isRegister ? 'Register' : 'Sign In'}</b>
      <br />
      {isRegister && (
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ margin: 4 }}
        />
      )}
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ margin: 4 }}
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ margin: 4 }}
      />
      {isRegister && (
        <select value={role} onChange={e => setRole(e.target.value as 'local' | 'buyer')} style={{ margin: 4 }}>
          <option value="buyer">Buyer</option>
          <option value="local">Local</option>
        </select>
      )}
      <button type="submit" style={{ marginLeft: 8 }} disabled={loading}>
        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
      </button>
      <button type="button" style={{ marginLeft: 8 }} onClick={() => setIsRegister(r => !r)}>
        {isRegister ? 'Have an account? Sign In' : 'No account? Register'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};
