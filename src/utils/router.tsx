/**
 * A tiny hash router (≈60 lines) so the game needs no routing dependency and the
 * production build works from any static host or folder (no server rewrites needed).
 * URLs look like  #/kids/play/layan-morning
 */
import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

function currentPath(): string {
  const h = window.location.hash.replace(/^#/, '');
  return h.startsWith('/') ? h : '/';
}

const RouteCtx = createContext<string>('/');

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const on = () => setPath(currentPath());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return <RouteCtx.Provider value={path}>{children}</RouteCtx.Provider>;
}

export function usePath() {
  return useContext(RouteCtx);
}

export function navigate(to: string) {
  if (currentPath() === to) return;
  window.location.hash = to;
}

/** Match "/kids/play/:id" against a path; returns params or null. */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('?')[0].split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, ...rest }: LinkProps) {
  const path = usePath();
  const active = path === to || (to !== '/' && path.startsWith(to + '/'));
  return (
    <a href={'#' + to} aria-current={path === to ? 'page' : undefined} data-active={active || undefined} {...rest}>
      {children}
    </a>
  );
}
