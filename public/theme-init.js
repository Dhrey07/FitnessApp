// Applies the saved theme before first paint so dark mode never flashes light.
// Mirrors src/components/theme/ThemeProvider.tsx (storage key 'ericonet_theme').
(function(){try{var t=localStorage.getItem('ericonet_theme')||'light';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;c.toggle('dark',d);c.toggle('light',!d);}catch(e){}})();
