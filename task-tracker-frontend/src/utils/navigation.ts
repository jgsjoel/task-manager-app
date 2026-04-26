import React from 'react';
let currentPath = window.location.pathname;

export const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  currentPath = path;
  window.dispatchEvent(new Event('popstate'));
};

export const useLocation = () => {
  const [pathname, setPathname] = React.useState(currentPath);

  React.useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      currentPath = window.location.pathname;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { pathname };
};

export const Navigate = ({ to }: { to: string }) => {
  React.useEffect(() => {
    navigate(to);
  }, [to]);

  return null;
};
