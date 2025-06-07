// Authentication context and provider for user state management
import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'local' | 'buyer' | null;
export interface User {
  id: string;
  name: string;
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

// Auth UI component for login/logout and role selection
import React from 'react';

export const AuthUI: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'local' | 'buyer'>('buyer');
  const [isVerified, setIsVerified] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

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
    <form
      onSubmit={e => {
        e.preventDefault();
        login({
          id: Math.random().toString(36).slice(2),
          name,
          role,
          isVerified: role === 'local' ? isVerified : true,
          subscriptionActive: role === 'local' ? subscriptionActive : undefined,
        });
      }}
      style={{ marginBottom: 24, background: '#f6f6f6', padding: 16, borderRadius: 8 }}
    >
      <b>Sign In</b>
      <br />
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ margin: 4 }}
      />
      <select value={role} onChange={e => setRole(e.target.value as 'local' | 'buyer')} style={{ margin: 4 }}>
        <option value="buyer">Buyer</option>
        <option value="local">Local</option>
      </select>
      {role === 'local' && (
        <>
          <label style={{ marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={isVerified}
              onChange={e => setIsVerified(e.target.checked)}
            />
            Verified
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={subscriptionActive}
              onChange={e => setSubscriptionActive(e.target.checked)}
            />
            Subscription Active
          </label>
        </>
      )}
      <button type="submit" style={{ marginLeft: 8 }}>Sign In</button>
    </form>
  );
};
