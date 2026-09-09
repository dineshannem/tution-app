import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | 'guest';
  login: (usernameOrEmail: string, password?: string, role?: UserRole, captchaToken?: string, captchaAnswer?: string) => Promise<{ success: boolean; message?: string; user?: User; retryAfterMs?: number; attemptsRemaining?: number }>;
  logout: () => void;
  switchRole: (role: UserRole | 'guest') => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_TEACHER: User = {
  id: "c_teacher",
  name: "Samba Siva Reddy Annem",
  email: "teacher@ssrtuition.com",
  role: "teacher",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

const DEFAULT_STUDENT: User = {
  id: "c_std_s1001",
  name: "student01",
  email: "student01@ssrtuition.com",
  role: "student",
  phone: "+91 91234 56789",
  studentId: "s1001",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
};

const DEFAULT_PARENT: User = {
  id: "c_prn_p1001",
  name: "parent01",
  email: "parent01@gmail.com",
  role: "parent",
  phone: "+91 98111 22233",
  parentId: "p1001",
  studentId: "s1001",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ssr_user') || localStorage.getItem('kkr_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<UserRole | 'guest'>(() => {
    const savedRole = localStorage.getItem('ssr_role') || localStorage.getItem('kkr_role');
    return (savedRole as UserRole | 'guest') || 'guest';
  });

  useEffect(() => {
    if (user && role !== 'guest') {
      localStorage.setItem('ssr_user', JSON.stringify(user));
      localStorage.setItem('ssr_role', user.role);
    } else {
      localStorage.removeItem('ssr_user');
      localStorage.setItem('ssr_role', 'guest');
    }
  }, [user, role]);

  const login = async (
    usernameOrEmail: string,
    password?: string,
    requestedRole: UserRole = 'student',
    captchaToken?: string,
    captchaAnswer?: string
  ): Promise<{ success: boolean; message?: string; user?: User; retryAfterMs?: number; attemptsRemaining?: number }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password, role: requestedRole, captchaToken, captchaAnswer })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, message: data.error, retryAfterMs: data.retryAfterMs, attemptsRemaining: data.attemptsRemaining };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Server connection error. Please try again.' };
    }

    return { success: false, message: 'Invalid username or password. Check credentials directory.' };
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('ssr_user', JSON.stringify(updatedUser));
    localStorage.setItem('ssr_role', updatedUser.role);
  };

  const logout = () => {
    setUser(null);
    setRole('guest');
    localStorage.removeItem('ssr_user');
    localStorage.setItem('ssr_role', 'guest');
  };

  const switchRole = (newRole: UserRole | 'guest') => {
    setRole(newRole);
    if (newRole === 'guest') {
      setUser(null);
    } else if (!user || user.role !== newRole) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        switchRole,
        updateUser,
        isAuthenticated: !!user && role !== 'guest'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
