import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';

describe('ProtectedRoute', () => {
  const mockNavigate = vi.fn();
  
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      Navigate: ({ to }) => {
        mockNavigate(to);
        return <div>Redirecting to {to}</div>;
      }
    };
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithAuth = (component, authValue) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          {component}
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('should render children when authenticated', () => {
    const authValue = {
      isAuthenticated: true,
      user: { role: 'PATIENT' },
      loading: false
    };

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    const authValue = {
      isAuthenticated: false,
      user: null,
      loading: false
    };

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    const authValue = {
      isAuthenticated: false,
      user: null,
      loading: true
    };

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should check role permissions when role prop is provided', () => {
    const authValue = {
      isAuthenticated: true,
      user: { role: 'PATIENT' },
      loading: false
    };

    renderWithAuth(
      <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      authValue
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
