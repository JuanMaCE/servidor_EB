import type { ReactNode } from 'react';
import { Music2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-glow app-glow-top" />
      <div className="app-glow app-glow-bottom" />
      <div className="app-shell-content">
        <header className="app-header">
          <Link to="/" className="app-brand" aria-label="Ir al inicio">
            <Music2 size={30} />
            <strong>EB Music <span>Studio</span></strong>
          </Link>
          <nav className="app-nav" aria-label="Navegación principal">
            <NavLink to="/songs">Secuencias</NavLink>
            <NavLink to="/lyrics">Letras</NavLink>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
