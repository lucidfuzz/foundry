const GLYPHS = {
  camera: 'M3 3h18v18H3zM6 6v12h12V6zM10 10h4v4h-4z',
  photos: 'M3 3h8v8H3zM13 3h8v8h-8zM13 13h8v8h-8zM3 13h8v8H3zM5 15v4h4v-4z',
  maps: 'M12 2l10 19H2zM12 9.5l-5 9h10z',
  calendar: 'M3 3h4v4H3zM10 3h4v4h-4zM17 3h4v4h-4zM3 10h4v4H3zM10 10h11v11H10zM3 17h4v4H3z',
  phone: 'M3 3h5a13 13 0 0 0 13 13v5C11 21 3 13 3 3zM3 18h3v3H3z',
  messages: 'M3 4h18v4H3zM3 10h12v4H3zM3 16h7v4H3z',
  browser: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zM12 5a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM2 11h20v2H2z',
  music: 'M2 9h3.5l5-5v16l-5-5H2zM16.243 7.757A6 6 0 0 1 16.243 16.243L14.828 14.828A4 4 0 0 0 14.828 9.172zM19.071 4.929A10 10 0 0 1 19.071 19.071L17.657 17.657A8 8 0 0 0 17.657 6.343z',
  youtube: 'M2 5h20v14H2zM5 8v8h14V8zM10 9.2l5.2 2.8-5.2 2.8z',
  instagram: 'M3 3h18v18H3zM6 6v12h12V6zM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM12 9.6a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 0 0 0-4.8zM15.4 6.9h1.7v1.7h-1.7z',
  discord: 'M12 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM5 15a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM19 15a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM11 8.5h2v4.2l4.6 3.3-1.2 1.6-4.4-3.2-4.4 3.2-1.2-1.6 4.6-3.3z'
};
const GLYPHSETS = {
  market: {
    camera: 'M12 5c4.6 0 8.3 3.1 10 7-1.7 3.9-5.4 7-10 7s-8.3-3.1-10-7c1.7-3.9 5.4-7 10-7zM12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7zM10.2 13.6l3.6-3.6.9.9-3.6 3.6zM10.4 10a.8.8 0 1 1 0 1.6a.8.8 0 0 1 0-1.6zM13.6 12.4a.8.8 0 1 1 0 1.6a.8.8 0 0 1 0-1.6z',
    photos: 'M3 4h18v16H3zM5 6v12h14V6zM6 16l3.5-4 2.5 2 3-4.5L18 13v3z',
    maps: 'M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zM12 5.5l-3 4h2v3h2v-3h2z',
    calendar: 'M4 5h16v15H4zM6 9v9h12V9zM7 2h2v4H7zM15 2h2v4h-2zM8.5 13.2l1.3-1.3 1.7 1.7 3.7-3.7 1.3 1.3-5 5z',
    phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z',
    messages: 'M3 4h18v12h-8l-5 4v-4H3zM5 6v8h5v1.8L12.3 14H19V6zM11.2 7h1.6v.9c1 .2 1.7.8 1.8 1.7h-1.5c-.1-.4-.5-.6-1.1-.6-.6 0-.9.2-.9.5s.3.4 1.2.6c1.4.3 2.3.7 2.3 1.8 0 .9-.7 1.5-1.8 1.7v.9h-1.6v-.9c-1.1-.2-1.9-.9-1.9-1.9h1.5c.1.5.6.8 1.3.8.6 0 1-.2 1-.6 0-.3-.3-.5-1.2-.7-1.3-.3-2.3-.6-2.3-1.7 0-.8.6-1.4 1.6-1.6z',
    browser: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zM12 4.2a7.8 7.8 0 1 0 0 15.6a7.8 7.8 0 0 0 0-15.6zM8 9h1.6v6H8zM8.5 7.5h.6V9h-.6zM8.5 15h.6v1.5h-.6zM11.2 11h1.6v5h-1.6zM11.7 9.5h.6V11h-.6zM14.4 8h1.6v4h-1.6zM14.9 6.5h.6V8h-.6zM14.9 12h.6v1.5h-.6z',
    music: 'M9 3h11v13.5a3 3 0 1 1-2-2.8V7h-7v9.5a3 3 0 1 1-2-2.8zM14.5 9.5l2-2 2 2h-1.3V12h-1.4V9.5z',
    youtube: 'M3 4h18v14H3zM5 6v10h14V6zM10 8l5 3-5 3zM3 19.5h18V21H3z',
    instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM7.2 16.6l9.4-9.4 1.2 1.2-9.4 9.4zM8 6.5a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 0 1 0-3.2zM16 14.3a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 0 1 0-3.2z',
    discord: 'M12 3a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 12 3zM5 5.5a2.2 2.2 0 1 1 0 4.4a2.2 2.2 0 0 1 0-4.4zM19 5.5a2.2 2.2 0 1 1 0 4.4a2.2 2.2 0 0 1 0-4.4zM7.5 15c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5V17h-9zM1.5 15.5c0-2 1.6-3.6 3.5-3.6 1 0 1.8.4 2.4 1-.5.8-.9 1.8-.9 3.1H1.5zM22.5 15.5c0-2-1.6-3.6-3.5-3.6-1 0-1.8.4-2.4 1 .5.8.9 1.8.9 3.1h5zM2 19h20v2H2z'
  },
  cyber: {
    camera: 'M3 7h4l2-3h6l2 3h4v13H3zM5 9v9h14V9zM12 10.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zM12 12.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM16 10h2v1.5h-2z',
    photos: 'M3 5h18v14H3zM5 7v10h14V7zM6 16l4-5 3 3.5 2-2.5 3 4zM15 8.5h2.5V11H15z',
    maps: 'M12 2l7 4v12l-7 4-7-4V6zM12 4.3L7 7.2v9.6l5 2.9 5-2.9V7.2zM12 8l3 4.5-3 4.5-3-4.5z',
    calendar: 'M4 5h16v15H4zM6 9v9h12V9zM7 2h2v4H7zM15 2h2v4h-2zM8 11h3v3H8zM13 11h3v3h-3z',
    phone: 'M6 2h8l4 4v16H6zM8 4v14h8V7l-3-3zM10 19h4v1.5h-4z',
    messages: 'M3 4h18v12h-8l-5 4v-4H3zM5 6v8h5v1.8L12.3 14H19V6zM7 8h10v1.6H7zM7 11h6v1.6H7z',
    browser: 'M12 2l9 5v10l-9 5-9-5V7zM5 8.2v7.6l6 3.3v-7.6zM13 11.5v7.6l6-3.3V8.2zM6.2 6.6L12 9.8l5.8-3.2L12 3.4z',
    music: 'M9 3h11v13.5a3 3 0 1 1-2-2.8V7h-7v9.5a3 3 0 1 1-2-2.8z',
    youtube: 'M2 6l3-3h14l3 3v12l-3 3H5l-3-3zM4 7v10l2 2h12l2-2V7l-2-2H6zM10 8.5l6 3.5-6 3.5z',
    instagram: 'M4 4h16v16H4zM6 6v12h12V6zM12 8.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zM12 10.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM15.5 7h1.8v1.8h-1.8z',
    discord: 'M4 6h16v10h-3l-1 3h-2l1-3H9l1 3H8l-1-3H4zM6 8v6h12V8zM8 10h2v2H8zM14 10h2v2h-2z'
  },

  vapor: {
    camera: 'M3 7h18v12H3zM8 4h8v3H8zM5 9v8h14V9zM10 10h4v1h1v4h-1v1h-4v-1H9v-4h1z',
    photos: 'M3 4h18v16H3zM5 6v10h14V6zM6 15h2v-2h2v-2h2v2h2v-3h2v5z',
    maps: 'M3 5h5v14H3zM9.5 4h5v14h-5zM16 5h5v14h-5z',
    calendar: 'M3 5h18v15H3zM5 9v9h14V9zM6 2h2v4H6zM16 2h2v4h-2zM7 11h2v2H7zM11 11h2v2h-2zM15 11h2v2h-2zM7 14h2v2H7zM11 14h2v2h-2z',
    phone: 'M7 2h10v20H7zM9 4v5h6V4zM9 11h2v2H9zM13 11h2v2h-2zM9 15h2v2H9zM13 15h2v2h-2z',
    messages: 'M2 3h20v14H8l-4 4v-4H2zM4 5v1h16V5zM4 8v7h16V8z',
    browser: 'M8 2h8v2h2v2h2v4h2v4h-2v4h-2v2h-2v2H8v-2H6v-2H4v-4H2v-4h2V6h2V4h2zM8 4v2H6v4h4V6h4v4h4V6h-2V4zM6 12v4h2v2h8v-2h2v-4z',
    music: 'M2 5h20v14H2zM4 7v10h16V7zM7 9a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM17 9a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM6 15h12v1.5H6z',
    youtube: 'M3 5h18v13H3zM5 7v9h14V7zM10 9v5l4-2.5zM8 19h8v2H8z',
    instagram: 'M4 2h16v20H4zM6 4v12h12V4zM12 7a3 3 0 1 1 0 6a3 3 0 0 1 0-6z',
    discord: 'M4 4h16v10h-8l-4 4v-4H4zM6 6v6h12V6zM8 8h2v2H8zM11 8h2v2h-2zM14 8h2v2h-2z'
  },
  nature: {
    camera: 'M7 6a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zM17 6a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zM7 8a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM17 8a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM10.5 8h3v3h-3zM5 3h4v2.5H5zM15 3h4v2.5h-4z',
    photos: 'M4 3h16v18H4zM6 5v14h12V5zM12 6.5c2.8 1.8 3.8 4.6 2.8 8.2l-2 1.3V9.5h-1.6V16l-2-1.3c-1-3.6 0-6.4 2.8-8.2z',
    maps: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zM12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM12 6l2.5 6L12 18l-2.5-6z',
    calendar: 'M12 2l1.2 3.2L16 4l-.6 3.4L19 8.5 16.8 11 19 13.5 15.4 14.6 16 18l-2.8-1.2L12 20l-1.2-3.2L8 18l.6-3.4L5 13.5 7.2 11 5 8.5l3.6-1.1L8 4l2.8 1.2zM12 7.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7z',
    phone: 'M12 2l1 2h4a3 3 0 0 1 3 3v1H4V7a3 3 0 0 1 3-3h4zM5 10h14c0 6-3.5 11-7 12-3.5-1-7-6-7-12z',
    messages: 'M20 3c-8 0-14 5-15 13l-2 5h2l1.5-3.5C14 16 19 10 20 3zM7.5 15.5c1-4 4-7.5 9-9.5-3 3-5.5 6.2-9 9.5z',
    browser: 'M12 2l7 9h-3l4 6h-7v5h-2v-5H4l4-6H5z',
    music: 'M3 12c3-1 6 0 8 2 1-4 5-7 10-7-1 2-2 3-4 4 1 4-2 8-7 8-3 0-5-2-7-7zM15 9.5a.9.9 0 1 0 0 1.8a.9.9 0 0 0 0-1.8z',
    youtube: 'M12 3c5 0 9 3 9 7H3c0-4 4-7 9-7zM9 11h6v8a3 3 0 0 1-6 0zM8 6a1.3 1.3 0 1 0 0 2.6a1.3 1.3 0 0 0 0-2.6zM15 5.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2z',
    instagram: 'M12 2a3 3 0 0 1 2.6 4.5A3 3 0 0 1 19.5 9a3 3 0 0 1-2 4.6A3 3 0 0 1 14 18a3 3 0 0 1-4 0 3 3 0 0 1-3.5-4.4A3 3 0 0 1 4.5 9a3 3 0 0 1 4.9-2.5A3 3 0 0 1 12 2zM12 9a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM11 18h2v4h-2z',
    discord: 'M12 2c3 3 5 6 5 9a5 5 0 0 1-10 0c0-1.5.6-3 1.6-4.2.2 1.4 1 2.4 2 2.7C10 7 10.8 4.4 12 2zM3 19l18-3 .5 2L3.5 21zM21 19L3 16l-.5 2 18 3z'
  },
  rabbit: {
    camera: 'M12 6c4.5 0 8 3.5 9.5 6-1.5 2.5-5 6-9.5 6s-8-3.5-9.5-6C4 9.5 7.5 6 12 6zM12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7zM12 10.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3zM19 1.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z',
    photos: 'M7 3h10l4 6-9 12L3 9zM8.2 5L6 8.6h4.2L11 5zM13 5l.8 3.6H18L15.8 5zM6.4 10.6l4.6 6.4-1.4-6.4zM12 10.6l-1.6 6.7L12 19l1.6-1.7-1.6-6.7zM14.4 10.6L13 17l4.6-6.4z',
    maps: 'M4 18h2.5v2.5H4zM8.5 15h2.5v2.5H8.5zM12 11.5h2.5V14H12zM15.5 8h2.5v2.5h-2.5zM18 2l3 5h-6z',
    calendar: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zM12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM11 5.5h2v3h-2zM11 15.5h2v3h-2zM5.5 11h3v2h-3zM15.5 11h3v2h-3zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM11.2 10.2l1.6 0 .6 2.6-1.4 1-1.4-1z',
    phone: 'M7 2h10v20H7zM9 4v12h6V4zM11 18h2v2h-2zM18 3l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z',
    messages: 'M5 3h14v18H5zM7 5v14h10V5zM12 8l1 2.2 2.2 1L13 12.2 12 14.4l-1-2.2-2.2-1L11 10.2zM8 16h8v1.5H8z',
    browser: 'M4 3h16v18H4zM6 5v14h12V5zM12 7.5a2.5 2.5 0 0 1 1.3 4.6L14 16h-4l.7-3.9A2.5 2.5 0 0 1 12 7.5z',
    music: 'M9 4l10-2v13.5a3 3 0 1 1-2-2.8V6.5l-6 1.2v9.8a3 3 0 1 1-2-2.8zM4 2l.7 1.5 1.5.7-1.5.7L4 6.4l-.7-1.5-1.5-.7 1.5-.7z',
    youtube: 'M12 21c-1-1-9-6.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-8 11-9 12zM10 8.5v6l5-3z',
    instagram: 'M2 9c3-2 6-2 10 0 4-2 7-2 10 0-.5 4-3 7-6 7-2 0-3-1.5-4-3-1 1.5-2 3-4 3-3 0-5.5-3-6-7zM5 10.5c.3 2 1.6 3.5 3 3.5 1.2 0 2-1 2.5-2.4-1.8-1-3.6-1.4-5.5-1.1zM19 10.5c-1.9-.3-3.7.1-5.5 1.1.5 1.4 1.3 2.4 2.5 2.4 1.4 0 2.7-1.5 3-3.5z',
    discord: 'M12 2.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM4.5 15a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM19.5 15a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM11 7h2c0 3 1 5 5.2 7.4l-1 1.7C14.5 14.5 13 13 12 11c-1 2-2.5 3.5-5.2 5.1l-1-1.7C10 12 11 10 11 7z'
  },
  deeprange: {
    camera: 'M2 2h7v2.2H4.2V9H2zM15 2h7v7h-2.2V4.2H15zM2 15h2.2v4.8H9V22H2zM19.8 15H22v7h-7v-2.2h4.8zM12 8.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7z',
    photos: 'M4 8l12-4 4 10-12 4zM6.6 9.2l2.6 6.6 8.2-2.7-2.6-6.6zM2 13l2-.7 2.9 7.3 10-3.3.7 2L6 22z',
    maps: 'M2 4h20L12 21zM6 6.2L12 16.6 18 6.2zM12 7.6a1.8 1.8 0 1 1 0 3.6a1.8 1.8 0 0 1 0-3.6z',
    calendar: 'M3 3h8v5H3zM13 3h8v8h-8zM3 10h8v11H3zM13 13h8v8h-8zM5 12v7h4v-7zM15 15v4h4v-4z',
    phone: 'M12 14a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM4.9 11.1a10 10 0 0 1 14.2 0l-1.6 1.6a7.7 7.7 0 0 0-11 0zM8.1 14.3a5.5 5.5 0 0 1 7.8 0l-1.6 1.6a3.2 3.2 0 0 0-4.6 0zM1.7 7.9a14.5 14.5 0 0 1 20.6 0l-1.6 1.6a12.2 12.2 0 0 0-17.4 0z',
    messages: 'M2 4h20v12h-8l-4 4v-4H2zM5 7v2h14V7zM5 11v2h9v-2z',
    browser: 'M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zM1.5 13.6c-.9-2.2 3.4-4.8 9.6-5.9l.4 1.9c-5.1.9-8 2.6-7.8 3.5.4 1 4.7 1.6 10.4.6 5.6-1 9.4-3.1 9-4.1-.2-.5-1.4-.8-3.3-.9l.1-1.9c2.7.1 4.6.7 5 1.9.9 2.2-3.8 5.2-10.4 6.4-6.6 1.2-12.1.7-13-1.5z',
    music: 'M2 10h2.5v4H2zM6 7h2.5v10H6zM10 3h2.5v18H10zM14 6h2.5v12H14zM18 9h2.5v6H18z',
    youtube: 'M2 4h20v16H2zM4.2 6.2v11.6h15.6V6.2zM9.5 8.5v7l6-3.5z',
    instagram: 'M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM12 5.4a6.6 6.6 0 1 0 0 13.2a6.6 6.6 0 0 0 0-13.2zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z',
    discord: 'M12 2.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM4 16.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM20 16.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM11 7.5h2v4l5.6 5.3-1.4 1.4-5.2-4.9-5.2 4.9-1.4-1.4L11 11.5zM6.5 18.2h11v1.6h-11z'
  },
  directive: {
    camera: 'M12 2l8.66 5v10L12 22l-8.66-5V7zM12 5.2L5.9 8.7v6.6L12 18.8l6.1-3.5V8.7zM12 9l2.6 1.5v3L12 15l-2.6-1.5v-3z',
    photos: 'M3 7h13v13H3zM5 9v9h9V9zM7 3h14v14h-3v-2h1V5H9v1H7z',
    maps: 'M12 2l9 20-9-5.2L3 22zM12 7.6L7.2 18.4 12 15.6l4.8 2.8z',
    calendar: 'M3 3h5v5H3zM9.5 3h5v5h-5zM16 3h5v5h-5zM3 9.5h5v5H3zM9.5 9.5h11.5v11.5H9.5zM11.5 11.5v7.5h7.5v-7.5zM3 16h5v5H3z',
    phone: 'M4 3h6l1.5 5-3 2.2 5.3 5.3 2.2-3 5 1.5v6h-5C9 20 4 15 4 8z',
    messages: 'M3 4h18v12H10l-5 4v-4H3zM6 7v2h12V7zM6 11v2h8v-2z',
    browser: 'M11 2h2v4h-2zM11 18h2v4h-2zM2 11h4v2H2zM18 11h4v2h-4zM12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14zM12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9zM11 11h2v2h-2z',
    music: 'M2 10h2.5v4H2zM6 7h2.5v10H6zM10 3h2.5v18H10zM14 6h2.5v12H14zM18 9h2.5v6H18z',
    youtube: 'M12 2l8.66 5v10L12 22l-8.66-5V7zM10 8v8l6.2-4z',
    instagram: 'M6.5 3h11L21 6.5v11L17.5 21h-11L3 17.5v-11zM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10zM12 9.4a2.6 2.6 0 1 1 0 5.2a2.6 2.6 0 0 1 0-5.2z',
    discord: 'M12 2l8.66 5v10L12 22l-8.66-5V7zM12 5.2L5.9 8.7v6.6L12 18.8l6.1-3.5V8.7zM8 10h8v1.8H8zM8 13h5v1.8H8z'
  },
  longroad: {
    camera: 'M21 2C13 3 7 8 5 15l-2 6 1 1 6-2C17 18 21 10 21 2zM8.2 16.6L16.6 7.6l.9.9-8.4 9z',
    photos: 'M4 2h16v20H4zM6.2 4.2v15.6h11.6V4.2zM12 7a3.6 4.6 0 1 1 0 9.2A3.6 4.6 0 0 1 12 7z',
    maps: 'M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9L1.5 12l7.9-2.6zM12 10a2 2 0 1 0 0 4a2 2 0 0 0 0-4z',
    calendar: 'M14.5 2.5a9.5 9.5 0 1 0 7 15.6A7.6 7.6 0 0 1 14.5 2.5zM18.5 3.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z',
    phone: 'M12 2.5a1.6 1.6 0 0 1 1.6 1.6v.8A6.2 6.2 0 0 1 18.2 11v4l2.3 3.2H3.5L5.8 15v-4a6.2 6.2 0 0 1 4.6-6.1v-.8A1.6 1.6 0 0 1 12 2.5zM9.6 19.4h4.8a2.4 2.4 0 0 1-4.8 0z',
    messages: 'M2.5 5h19v14h-19zM4.4 6.6l7.6 5.6 7.6-5.6h-2.2L12 10.2 6.6 6.6zM12 13.4a2.3 2.3 0 1 0 0 4.6a2.3 2.3 0 0 0 0-4.6z',
    browser: 'M3 4h4.2v17H3zM8.4 6.5h4.2V21H8.4zM14.2 5.4l4-1.1 3.9 14.8-4 1.1zM4.2 7v1.4h1.8V7zM9.6 9.5v1.4h1.8V9.5z',
    music: 'M14.6 2.4l1.9-.9 1.6 1.6-.9 1.9-3 3a6.8 6.8 0 1 1-2.6-2.6zM9.4 12.2a2 2 0 1 0 0 4a2 2 0 0 0 0-4zM16.9 3.1l.9.9-4.9 4.9-.9-.9z',
    youtube: 'M2 2h20v3.4H2zM2 5.4h4.6V22H2zM17.4 5.4H22V22h-4.6zM9.6 10v7l6-3.5z',
    instagram: 'M12 1.5a6.4 7.4 0 1 1 0 14.8a6.4 7.4 0 0 1 0-14.8zM12 4.2a4 5 0 1 0 0 10a4 5 0 0 0 0-10zM10.9 16.2h2.2V22.5h-2.2z',
    discord: 'M5 6h11v14H5zM7 8v10h7V8zM16 9h2.5a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1-2.5 2.5H16v-2h2.5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5H16zM5 3.5c1.5-1.5 3.5-1.5 5.5 0 1.5-1 3.5-1 5.5 0V6H5z'
  },
  nightfall: {
    camera: 'M2.5 9.5a4 4 0 0 1 8 0V17a4 4 0 0 1-8 0zM13.5 9.5a4 4 0 0 1 8 0V17a4 4 0 0 1-8 0zM4.6 13v4a1.9 1.9 0 0 0 3.8 0v-4zM15.6 13v4a1.9 1.9 0 0 0 3.8 0v-4zM10.5 8h3v4h-3z',
    photos: 'M2.5 2.5h6v2.2H4.7v3.8H2.5zM15.5 2.5h6v6h-2.2V4.7h-3.8zM2.5 15.5h2.2v3.8h3.8v2.2h-6zM19.3 15.5h2.2v6h-6v-2.2h3.8zM12 7.2a4.8 4.8 0 1 1 0 9.6a4.8 4.8 0 0 1 0-9.6z',
    maps: 'M12 1.5L22.5 12 12 22.5 1.5 12zM12 5.4L5.4 12 12 18.6 18.6 12zM12 8.4l3.4 6H8.6z',
    calendar: 'M5.5 3h13v19h-13zM7.6 5.6v14.3h8.8V5.6zM9.4 2h5.2v3H9.4zM9.4 8.4h5.2V10H9.4zM9.4 12h5.2v1.6H9.4zM9.4 15.6h3.4v1.6H9.4z',
    phone: 'M7.5 6h9v16h-9zM9.6 8.2v4.6h4.8V8.2zM10.8 14.6h2.4V17h-2.4zM10.8 18.4h2.4v2.2h-2.4zM14 1h1.8v5H14z',
    messages: 'M2 5l8 7-8 7v-3.6L5.8 12 2 8.6zM11 5l8 7-8 7v-3.6l3.8-3.4L11 8.6zM20 10.8h2v2.4h-2z',
    browser: 'M10.9 10h2.2v12h-2.2zM12 3.5a8.5 8.5 0 0 1 8.5 8.5h-2.3a6.2 6.2 0 0 0-12.4 0H3.5A8.5 8.5 0 0 1 12 3.5zM12 7.6a4.4 4.4 0 0 1 4.4 4.4h-2.2a2.2 2.2 0 0 0-4.4 0H7.6A4.4 4.4 0 0 1 12 7.6z',
    music: 'M3.5 13a8.5 8.5 0 0 1 17 0v7h-4.6v-7.4h2.4a6.3 6.3 0 0 0-12.6 0h2.4V20H3.5z',
    youtube: 'M2 4.5h20v13H2zM4.2 6.7v8.6h15.6V6.7zM10 8.6v4.8l4.2-2.4zM8.5 19h7v2h-7z',
    instagram: 'M12 1.5a10.5 10.5 0 1 1 0 21a10.5 10.5 0 0 1 0-21zM12 4.2a7.8 7.8 0 1 0 0 15.6a7.8 7.8 0 0 0 0-15.6zM11.1 6h1.8v4.4h-1.8zM11.1 13.6h1.8V18h-1.8zM6 11.1h4.4v1.8H6zM13.6 11.1H18v1.8h-4.4z',
    discord: 'M3 6h18v10H13l-4 4v-4H3zM5 8v6h6v1.8L12.8 14H19V8zM7 10h2v2H7zM11 10h2v2h-2zM15 10h2v2h-2z'
  },
  grimoire: {
    camera: 'M12 1.5a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM8.6 5.6a3.4 3.4 0 0 0-2.4 2.6l1.5.3a1.9 1.9 0 0 1 1.3-1.4zM5.5 18.5h13l1.2 4H4.3z',
    photos: 'M12 3.5l6.5 8.5L12 22.5 5.5 12zM12 7.5L8.4 12 12 17.8l3.6-5.8zM10.9 0.8h2.2v3h-2.2z',
    maps: 'M12 1.5a10.5 10.5 0 1 1 0 21a10.5 10.5 0 0 1 0-21zM12 3.6a8.4 8.4 0 1 0 0 16.8a8.4 8.4 0 0 0 0-16.8zM12 5.4l1.7 4.9 4.9 1.7-4.9 1.7-1.7 4.9-1.7-4.9L5.4 12l4.9-1.7z',
    calendar: 'M5 2h14v2.2h-1.6c0 4-2.4 6-4 7.8 1.6 1.8 4 3.8 4 7.8H19V22H5v-2.2h1.6c0-4 2.4-6 4-7.8-1.6-1.8-4-3.8-4-7.8H5zM8.9 4.2c.2 2.8 1.9 4.6 3.1 5.8 1.2-1.2 2.9-3 3.1-5.8zM9 19.8h6c-.3-2-1.6-3.4-3-4.6-1.4 1.2-2.7 2.6-3 4.6z',
    phone: 'M3 8.6l12-4.9v16.6L3 15.4zM15 6.4h2v11.2h-2zM18.5 8.8h3v1.7h-3zM18.5 13.5h3v1.7h-3zM5 16h3.2l1 5H6z',
    messages: 'M2.5 14.5c2.8-.8 4.8-2.8 5.8-5.6.9-2.4 3-3.9 5.5-3.9l3.6-1.5-1 2.4c1.1 1.4 1.2 3.4.2 5.5-1.3 3.1-4.4 5.2-8.4 5.9l-2 3.7-.9-3.1c-1.5-.3-2.6-1.6-2.8-3.4zM14.6 7.2a.9.9 0 1 0 0 1.8a.9.9 0 0 0 0-1.8z',
    browser: 'M1.5 12C4.5 7 8.2 5 12 5s7.5 2 10.5 7c-3 5-6.7 7-10.5 7S4.5 17 1.5 12zM12 7.8a4.2 4.2 0 1 0 0 8.4a4.2 4.2 0 0 0 0-8.4zM12 10.3a1.7 1.7 0 1 1 0 3.4a1.7 1.7 0 0 1 0-3.4z',
    music: 'M5.8 2.5l1.8.9C6.4 6.6 7 9.8 9.4 11.6V5.5h1.7v8.2h1.8V5.5h1.7v6.1c2.4-1.8 3-5 1.8-8.2l1.8-.9c2 4 1 9-2.6 11.4V19h2v2.5H6.4V19h2v-4.1C4.8 12.5 3.8 7.5 5.8 2.5z',
    youtube: 'M12 1l2.2 6.6L21 5.5l-2.6 6.5L21 18.5l-6.8-2.1L12 23l-2.2-6.6L3 18.5l2.6-6.5L3 5.5l6.8 2.1zM10.2 9v6l5.1-3z',
    instagram: 'M12 3a6 7 0 1 1 0 14a6 7 0 0 1 0-14zM12 5.4a3.7 4.6 0 1 0 0 9.2a3.7 4.6 0 0 0 0-9.2zM10.9 16.8h2.2V22h-2.2zM12 0l.8 1.6 1.6.8-1.6.8-.8 1.6-.8-1.6-1.6-.8 1.6-.8z',
    discord: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zM12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM12 6l1.5 3h-3zM17.2 9.5l-.8 3.2-2.4-2.2zM6.8 9.5l3.2 1-2.4 2.2zM12 12a2 2 0 1 1 0 4a2 2 0 0 1 0-4z'
  }
};

const APPS = [
  ['camera', 'Camera'], ['photos', 'Photos'], ['maps', 'Maps'], ['calendar', 'Calendar'], ['phone', 'Phone'],
  ['messages', 'Messages'], ['browser', 'Safari'], ['music', 'Music'], ['youtube', 'YouTube'], ['instagram', 'Instagram'], ['discord', 'Discord']
];

const PRESETS = {
  halcyon: {
    id: 'halcyon', title: 'Halcyon Biofab', blurb: 'Technocratic biotech. A wireframe globe, mint paper and lavender.', edition: 'original',
    company: 'Halcyon Biofab', unit: 'HB-2893',
    colors: { ground: '#A6F3CC', ink: '#0E1512', accent: '#9D8CF2', panel: '#E3F7EC', glow: '#9D8CF2' },
    fonts: { display: 'Newsreader', mono: 'IBM Plex Mono' },
    motif: 'globe', texture: 'dots', marks: 'cross', iconStyle: 'frame', units: 'fahrenheit', upper: false,
    phrases: [['Mortality Is A', 'Legacy Feature'], ['Your Pulse,', 'Fully Licensed'], ['Upgrade Path:', 'Eternal'], ['Grown For What', 'Comes Next']],
    text: {
      headL: ['HALCYON', 'BIOFAB'], headR: ['LOT HB-2893-07', 'SENTIENCE: LEASED'],
      readL: ['NEURAL LEASE: ACTIVE', 'BIOSYNC: 99.7% STABLE', 'WARRANTY: PERPETUAL*'],
      readR: ['TIER III SUBSCRIBER', 'CONSENT ON FILE', 'GRIEF MODULE: DISABLED'],
      clock: 'T+00:00:07.42 // CYCLE NOMINAL', sideL: ['LAT', '00.000'], sideR: ['MER', 'Δ-07'],
      cornerL: ['SECTOR 07', 'NODE: ACTIVE'], cornerR: ['AUTH LVL III', 'UNIT HB-2893'],
      tickerL: 'SEQUENCE INTEGRITY VERIFIED · DO NOT DECOMPILE', tickerR: 'PROPERTY OF HALCYON BIOFAB · CLASS-IV ORGANISM',
      caption: 'SENTIENCE: LEASED · RENEWAL: AUTOMATIC',
      fine: 'TERMS: Biological continuity is licensed, not sold. Halcyon Biofab retains full rights to replicated memory, surplus emotion and residual dreams. Unauthorized aging voids warranty. Renewal is automatic and irrevocable.',
      foot: 'PATENT PENDING: YOU · 10.10.2893'
    },
    codes: { camera: 'CAM', photos: 'ARC', maps: 'NAV', calendar: 'CHR', phone: 'COM', messages: 'MSG', browser: 'NET', music: 'AUD', youtube: 'VID', instagram: 'OBS', discord: 'SYN' },
    widget: {
      scriptFont: 'Baskerville', txGraphic: 'helix', archive: true, oddity: 'mood',
      L: { vid: 'W-06 // VID · CULTURE FEED', obs: 'W-07 // OBS · SPECIMENS', dc: 'W-09 // SYNC · COLLECTIVE', status: 'W-01 // SUBJECT STATUS', next: 'NEXT ALLOCATION', none: 'No Allocations', noneSub: 'ROUTINE NOMINAL', ext: 'EXTERIOR',
        dur: 'DURATION', state: 'STATUS', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'ACTIVE', queued: 'QUEUED', standby: 'STANDBY',
        cell: 'CELL', cycle: 'CYCLE', shift: 'W-02 // SHIFT', activeLong: 'ALLOCATION ACTIVE', offTitle: 'Off Rotation', tx: 'W-05 // TRANSMISSION' },
      classes: ['DIRECTIVE', 'ADVISORY', 'MANDATORY READING', 'WELLNESS NOTICE']
    },
    slogans: [
      ['Mortality Is A Legacy Feature', 'MORTALITY SUNSET TASK FORCE'], ['Your Pulse, Fully Licensed', 'NEURAL LEASING DIVISION'],
      ['Upgrade Path: Eternal', 'OFFICE OF CONTINUITY'], ['Every Breath Accounted For', 'RESPIRATORY BILLING'],
      ['Consent Is Assumed', 'LEGAL // TERMS OF EXISTENCE'], ['Your Memories Are On File', 'MEMORY CUSTODY BUREAU'],
      ['Free Will Is In Closed Beta', 'PRODUCT ROADMAP COMMITTEE'], ['Your Next Body Ships In 3–5 Business Days', 'SHELL LOGISTICS & FULFILLMENT'],
      ['Loneliness Is A Known Issue', 'CUSTOMER EXPERIENCE // KNOWN ISSUES'], ['Hope Has Been Deprecated', 'PRODUCT ROADMAP COMMITTEE'],
      ['Your Empathy Score Is Pending Review', 'HUMAN RESOURCES (LITERAL)'], ['Report Any Unauthorized Feelings', 'COMPLIANCE & GRATITUDE']
    ]
  },
  directive: {
    id: 'directive', title: 'Directive Zero', blurb: 'A defense-agency terminal. Heavy compressed serif, amber alerts, hex arrays and a ring analyzer.',
    company: 'Directive Zero', unit: 'D-00',
    colors: { ground: '#0B0C0E', ink: '#F1ECE2', accent: '#FF7A1A', glow: '#46E27A', panel: '#131518', alert: '#E3242B' },
    fonts: { display: 'Shippori Mincho B1', mono: 'Barlow Condensed' },
    motif: 'alert', texture: 'scan', marks: 'frame', iconStyle: 'hex', glyphs: 'directive', units: 'fahrenheit', upper: true,
    phrases: [['Remain', 'Calm'], ['Hold', 'Position'], ['Do Not', 'Hesitate'], ['Return', 'To Base']],
    morePhrases: [["Seal", "Shelter"], ["Await", "Orders"], ["Ration", "Daylight"], ["Submit", "Doubt"], ["Count", "The Beds"], ["Ignore", "Knocking"], ["Smile", "On Cue"], ["Drill", "For Dawn"], ["Queue", "In Order"], ["Dim", "The Grid"], ["File", "All Fear"]],
    text: {
      topL: 'DIRECTIVE ZERO // OPERATOR TERMINAL', topR: 'D-00', tag: 'NOTICE', ref: 'REF. D-00 / CYCLE 283',
      timerLabel: 'ACTIVE TIME REMAINING', timer: '04:59:59', power: 'INTERNAL POWER', hexLabel: 'SECTOR GRID 7',
      syncLabel: 'SYNCHRONIZATION', sync: '41.3%',
      stats: [['LINK STABILITY', '97.2%'], ['OPERATOR PULSE', '112 BPM'], ['CONTAMINATION', '0.00%']],
      fine: 'NOTICE: Operator conduct is monitored at all times. Unauthorized withdrawal from active duty will be recorded. Remain calm. Remain indoors. Await further instruction.',
      foot: 'OPERATOR D-00 · DAY 283',
      homeTop: 'OBSERVATION // CONTINUOUS', sideL: ['ANALYSIS', 'PENDING'], sideR: ['THREAT', 'LEVEL 3'],
      cornerL: ['CLASSIFICATION', 'UNRESOLVED'], cornerR: ['INTERNAL POWER', '62%'],
      caption: 'REMAIN CALM · REMAIN INDOORS', rail: 'DIRECTIVE',
      tickerL: 'AUTHORIZED OPERATORS ONLY · ALL ACTIVITY RECORDED', tickerR: 'DIRECTIVE ZERO · DEFENSE COORDINATION TERMINAL'
    },
    codes: { camera: 'OPT', photos: 'REC', maps: 'GEO', calendar: 'OPS', phone: 'COM', messages: 'TXT', browser: 'NET', music: 'AUD', youtube: 'RCN', instagram: 'CIV', discord: 'CMD' },
    widget: {
      scriptFont: 'HiraMinProN-W6', txGraphic: 'sync', archive: true, oddity: 'eval', C: {
        solar: { label: 'SOLAR FEED', offline: 'Feed Severed', day: 'DAYLIGHT REMAINING', night: 'BLACKOUT PERIOD', setIn: 'SUNDOWN IN', riseIn: 'DAWN IN' },
        audio: { right: 'CH 08 · CIVIL DEFENSE', src: 'BROADCAST // YT MUSIC', metric: 'MORALE', tap: 'TAP TO TUNE IN · ON AIR ', foot: 'STAY ON THIS FREQUENCY',
          lines: ['Emergency Broadcast Standby', 'Morale Frequency Engaged', 'Sortie Playlist Loaded', 'Remain Calm. Listen.', 'Civil Defense Channel', 'Signal Clear. Proceed.'] },
        feeds: { right: '2 FEEDS UNDER WATCH', trace: 'OPERATOR VITALS // LIVE', rate: 'PULSE', tap: 'TAP A FEED TO REVIEW · WATCH ', foot: 'INFORMATION IS AMMUNITION', linked: 'MONITORED', status: 'UPLINK 02 // SECURE',
          yt: { line: 'Visual Recon', meters: ['ALERTNESS', 'ADRENALINE', 'FOCUS'], tag: 'CONTINUOUS SURVEILLANCE', queue: '∞ REELS', u1: 'MIN', u2: 'LEVEL', kv: ['QUEUE', 'EXPOSURE', 'INTEL DEPTH'], curve: 'VIGILANCE CURVE // WATCH', curveR: 'TARGET LOCK HELD', foot: 'WATCH. REPORT.' },
          ig: { line: 'Civilian Chatter', meters: ['MORALE', 'PARANOIA', 'STRESS'], tag: 'FEED: UNMONITORED', kv: ['CIVILIANS SCANNED', 'CREDIBILITY', 'MORALE DELTA'], curve: 'CHATTER VOLUME // 24H', curveR: 'PEAK 23:00 · CURFEW IGNORED', foot: 'OBSERVE. LOG. REPORT.' } }
      },
      L: { vid: 'W-06 // MONITOR WALL', obs: 'W-07 // DOSSIERS', dc: 'W-09 // COMMAND NET', solar: 'W-03 // DAYLIGHT WATCH', solarBig: 'W-03 // DAYLIGHT + ATMOSPHERICS', audio: 'W-04 // BROADCAST', feeds: 'W-06 // RECON FEEDS', status: 'W-01 // OPERATOR STATUS', next: 'NEXT SORTIE', none: 'Standby', noneSub: 'NO SORTIE SCHEDULED', ext: 'SURFACE',
        dur: 'DURATION', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'ENGAGED', queued: 'STAGED', standby: 'STANDBY',
        cell: 'INTERNAL POWER', cycle: 'DAY', shift: 'W-02 // ACTIVE TIME', activeLong: 'OPERATION IN PROGRESS', offTitle: 'Standby', tx: 'W-05 // PRIORITY SIGNAL' },
      classes: ['CAUTION', 'WARNING', 'DIRECTIVE', 'EMERGENCY']
    },
    slogans: [
      ['Remain Calm. Remain Indoors.', 'CIVIL DEFENSE BUREAU'], ['Shelter Drills Are Not Optional', 'CIVIL DEFENSE BUREAU'],
      ['Your Hesitation Has Been Logged', 'OPERATOR EVALUATION'], ['Synchronization Is A Team Effort', 'OPERATOR EVALUATION'],
      ['Do Not Look Directly At The Sky', 'ATMOSPHERIC SECURITY'], ['Power Will Be Rerouted At Dusk', 'MUNICIPAL GRID'],
      ['Excess Feelings Will Be Contained', 'PSYCHOLOGICAL OPERATIONS'], ['Your Loneliness Is Classified', 'INFORMATION SECURITY'],
      ['Smile For The Monitors', 'OBSERVATION DIVISION'], ['Containment Is A Form Of Care', 'SPECIAL OPERATIONS'],
      ['Do Not Open The Lower Levels', 'FACILITY SECURITY'], ['Your Fear Is Within Tolerance', 'MEDICAL DIVISION']
    ]
  },
  longroad: {
    id: 'longroad', title: 'The Long Road', blurb: 'A traveller\'s map. Parchment, sepia ink, red lettering and a hand-drawn route.',
    company: 'The Long Road', unit: 'DAY 283',
    colors: { ground: '#EEE1C4', ink: '#2B2117', accent: '#A3261C', glow: '#C9A24F', panel: '#F5EBD3' },
    fonts: { display: 'IM Fell English', mono: 'IM Fell English SC' },
    motif: 'map', texture: 'paper', marks: 'none', iconStyle: 'woodcut', glyphs: 'longroad', units: 'fahrenheit', upper: false,
    phrases: [['Pack More', 'Bread'], ['Keep The', 'Lantern Lit'], ['The Long', 'Way Home'], ['Walk On,', 'Wanderer']],
    morePhrases: [["Knock For", "Supper"], ["Save Half", "The Cheese"], ["Mind Your", "Map's Owner"], ["Post Goes", "By Pony"], ["Toll Paid", "In Riddles"], ["Socks Dry", "By The Fire"], ["Ask After", "The Ferry"], ["Crows Say", "Go Around"], ["Mend Now,", "Roam Later"], ["Tea First", "Then Ghosts"], ["Fens Keep", "Their Tales"]],
    text: {
      mapTitle: 'A Traveller\'s Map of the Long Road', journal: 'Four hundred miles behind. The rest, ahead.',
      foot: 'INKED AT THE LANTERN INN', caption: 'Keep the lantern lit.',
      places: ['The Lantern Inn', 'Ashwood', 'Greyhallow Fells', 'Hollowmere', 'The Wending Way', 'Saltmarsh Reach', 'Sheepcote Hills', 'Fenwick Marsh', 'Old Tower', 'Calder Ruins', 'Brindle', 'The Grey Sound', 'Pinewatch'],
      scale: 'LEAGUES'
    },
    codes: { camera: 'SKETCH', photos: 'ALBUM', maps: 'MAP', calendar: 'DAYS', phone: 'BELL', messages: 'POST', browser: 'LIBRARY', music: 'LUTE', youtube: 'PLAYS', instagram: 'PORTRAITS', discord: 'TAVERN' },
    widget: {
      scriptFont: 'Baskerville-SemiBold', txGraphic: 'route', archive: true, oddity: 'omens', C: {
        solar: { label: 'SKY WATCH', offline: 'Clouded Over', day: 'DAYLIGHT LEFT', night: 'NIGHTFALL', setIn: 'DUSK IN', riseIn: 'DAWN IN' },
        audio: { right: 'A TUNE FOR THE ROAD', src: 'THE MINSTREL // YT MUSIC', metric: 'MERRIMENT', tap: 'TAP TO HEAR A SONG · PLAYING ', foot: 'MIND THE BARD',
          lines: ['A Song For The Road', 'The Tavern Is Tuning Up', 'Hum Along, Traveller', 'Ballads From The Last Inn', 'A Lute Somewhere Nearby', 'Play Something Cheerful'] },
        feeds: { right: 'TWO CRIERS HEARD', trace: 'THE TOWN SQUARE // TODAY', rate: 'CHATTER', tap: 'TAP A CRIER TO LISTEN · SINCE ', foot: 'TALES TRAVEL FASTER THAN CARTS', linked: 'HEARD', status: 'CRIER BELL // RINGING',
          yt: { line: 'Travelling Players', meters: ['WONDER', 'MIRTH', 'RESOLVE'], tag: 'THE SHOW GOES ON', queue: 'ENDLESS ACTS', u1: 'INCH', u2: 'ACT', kv: ['PLAYBILL', 'CANDLE LEFT', 'ACTS SEEN'], curve: 'APPLAUSE // TONIGHT', curveR: 'ONE MORE ACT, THEN BED', foot: 'WATCH THE PLAYERS' },
          ig: { line: 'Village Gossip', meters: ['CURIOSITY', 'ENVY', 'WORRY'], tag: 'GOSSIP: ENDLESS', kv: ['NEIGHBORS HEARD', 'RUMORS TRUE', 'GOOD NAME'], curve: 'WHISPERS // THIS WEEK', curveR: 'PEAK AT SUPPER · CANDLES BURNT', foot: 'LISTEN. NOD. REPEAT.' } }
      },
      archiveList: [
        { t: 'I travel not to go anywhere, but to go. I travel for travel\'s sake.', by: 'R. L. STEVENSON · TRAVELS WITH A DONKEY · 1879' },
        { t: 'There is nothing half so much worth doing as simply messing about in boats.', by: 'KENNETH GRAHAME · THE WIND IN THE WILLOWS · 1908' },
        { t: 'I have met with but one or two persons in the course of my life who understood the art of Walking.', by: 'H. D. THOREAU · WALKING · 1862' }
      ],
      L: { vid: 'W-06 // THE PLAYBILL', obs: 'W-07 // THE GALLERY', dc: 'W-09 // THE TAVERN', solar: 'W-03 // SUN & SKY', solarBig: 'W-03 // SUN, SKY & WEATHER', audio: 'W-04 // THE MINSTREL', feeds: 'W-06 // CRIER & GOSSIP', status: 'W-01 // TRAVELLER\'S LEDGER', next: 'NEXT GATHERING', none: 'A Quiet Day', noneSub: 'NOTHING UPON THE ROAD', ext: 'SKIES',
        dur: 'HOURS', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HIGH / LOW', active: 'UNDERWAY', queued: 'AHEAD', standby: 'AT REST',
        cell: 'LANTERN OIL', cycle: 'DAY', shift: 'W-02 // THE ROAD', activeLong: 'ON THE ROAD', offTitle: 'At Rest', tx: 'W-05 // LETTERS & OMENS' },
      classes: ['A LETTER', 'AN OMEN', 'A PROVERB', 'A WARNING']
    },
    slogans: [
      ['Pack More Bread Than You Think', 'AN OLD WAYFARER'], ['Every Road Was Once A Rumor', 'THE CARTOGRAPHERS\' GUILD'],
      ['The Kettle Forgives All', 'THE INNKEEPER\'S BOOK'], ['Mind The Fog On The Low Road', 'CARVED ON A MILESTONE'],
      ['Small Doors Hide Long Halls', 'AN OLD WAYFARER'], ['Rest Is Also Part Of The Journey', 'THE HEALER\'S ALMANAC'],
      ['The Map Is Not The Mountain', 'THE CARTOGRAPHERS\' GUILD'], ['Keep The Lantern Lit', 'THE LAMPLIGHTERS'],
      ['Strangers Are Friends With Worse Directions', 'THE INNKEEPER\'S BOOK'], ['A Full Pantry Makes A Brave Heart', 'THE MILLER\'S WIFE'],
      ['Walk Until The Weather Turns', 'CARVED ON A MILESTONE'], ['Home Is The Last Inn On The Map', 'AN OLD WAYFARER']
    ]
  },
  nightfall: {
    id: 'nightfall', title: 'Nightfall Descent', blurb: 'First-person through a trooper\'s visor on a rainy night: compass, vitals, ammo, grenades and a motion tracker.',
    company: 'Nightfall Descent', unit: 'SQUAD 7',
    colors: { ground: '#070C16', ink: '#7FE0FF', accent: '#F2B33D', glow: '#3E8DFF', panel: '#0E1726', alert: '#FF4D4D' },
    fonts: { display: 'Oxanium', mono: 'Share Tech Mono' },
    motif: 'night', texture: 'rain', marks: 'none', iconStyle: 'visor', glyphs: 'nightfall', units: 'fahrenheit', upper: true,
    phrases: [['Drop Window', 'Open'], ['Stay', 'Low'], ['Night', 'Shift'], ['Rain', 'Check']],
    morePhrases: [["Visor", "Down"], ["Squad Seven", "Stack"], ["Roof Access", "Quiet"], ["Ammo Check", "Twice"], ["Supply Pod", "Catch"], ["Med Kit", "First"], ["Stairwell", "Clear"], ["Cold Ration", "Again"], ["Boot Prints", "Fresh"], ["City Lights", "Blink"], ["Rear Guard", "Waits"]],
    text: {
      topL: 'NIGHTFALL DESCENT // HELMET DISPLAY', topR: 'SQUAD 7', optics: 'OPTICS: LOW-LIGHT',
      alt: 'ALT 1,204 M', speed: 'DESCENT 41 M/S', window: 'DROP WINDOW 00:04:12', grid: 'GRID 9-K',
      legend: [['FRIENDLY', 'accent'], ['HOSTILE', 'alert'], ['SUPPLY', 'glow'], ['INTEL', 'ink']],
      foot: 'SQUAD 7 · NIGHT SHIFT', homeTop: 'HEADING 270 · LOW-LIGHT OPTICS', caption: 'BRACE · BRACE · BRACE',
      pod: 'POD 07 · SQUAD 7', stencil: ['BRACE FOR IMPACT', 'DO NOT OPEN IN ATMOSPHERE'],
      impact: '00:47', alt2: 'ALT 12,400 M', vel: 'VEL 1,180 M/S', brake: 'BRAKING THRUSTERS: ARMED',
      chute: 'CHUTE: STOWED', retro: 'RETRO FIRE @ 50 M', sync: 'SQUAD LINK 4/4', ammo: '32', reserve: '224', weapon: 'RIFLE // SEMI', feedL: 'CH 1 // SQUAD LEAD', feedR: 'CH 2 // POD 06'
    },
    codes: { camera: 'OPT', photos: 'REC', maps: 'NAV', calendar: 'OPS', phone: 'COM', messages: 'TXT', browser: 'NET', music: 'AUD', youtube: 'CAM', instagram: 'SQD', discord: 'TEAM' },
    widget: {
      scriptFont: 'AvenirNextCondensed-DemiBold', txGraphic: 'reentry', archive: true, oddity: 'hostile', C: {
        solar: { label: 'OPTICS FEED', offline: 'Sensors Offline', day: 'DAYLIGHT REMAINING', night: 'NIGHT OPS', setIn: 'DARK IN', riseIn: 'FIRST LIGHT IN' },
        audio: { right: 'CH 08 · SQUAD NET', src: 'COMMS // YT MUSIC', metric: 'MORALE', tap: 'TAP TO KEY IN · OPEN ', foot: 'STAY ON CHANNEL',
          lines: ['Squad Channel Open', 'Drop Music Loaded', 'Keep Comms Clear', 'Morale Track Engaged', 'Radio Silence Lifted', 'Patch Me Through'] },
        feeds: { right: '2 FEEDS LIVE', trace: 'SUIT TELEMETRY // LIVE', rate: 'HEART RATE', tap: 'TAP A FEED TO PATCH IN · ON ', foot: 'EYES UP, TROOPER', linked: 'PATCHED', status: 'HUD LINK // GREEN',
          yt: { line: 'Helmet Cam Replays', meters: ['ADRENALINE', 'FOCUS', 'FATIGUE'], tag: 'REPLAY LOOP', queue: '∞ CLIPS', u1: 'SEC', u2: 'LOOP', kv: ['QUEUE', 'ATTENTION', 'REPLAY DEPTH'], curve: 'ENGAGEMENT // THIS DROP', curveR: 'ONE MORE REPLAY', foot: 'REVIEW THE FOOTAGE' },
          ig: { line: 'Squad Chatter', meters: ['MORALE', 'RIVALRY', 'STRESS'], tag: 'CHATTER: CONSTANT', kv: ['SQUADMATES', 'RESPECT', 'EGO'], curve: 'CHATTER // 24H', curveR: 'PEAK 02:00 · NO SLEEP', foot: 'COPY THAT.' } }
      },
      archiveList: [
        { t: 'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.', by: 'SUN TZU · THE ART OF WAR · GILES TR. 1910' },
        { t: 'All warfare is based on deception.', by: 'SUN TZU · THE ART OF WAR · GILES TR. 1910' }
      ],
      L: { vid: 'W-06 // REPLAY', obs: 'W-07 // RECON PHOTOS', dc: 'W-09 // SQUAD NET', solar: 'W-03 // LIGHT DISCIPLINE', solarBig: 'W-03 // LIGHT + ATMOS', audio: 'W-04 // SQUAD COMMS', feeds: 'W-06 // TAC FEEDS', status: 'W-01 // TROOPER STATUS', next: 'NEXT DEPLOYMENT', none: 'Stand Down', noneSub: 'NO ORDERS QUEUED', ext: 'CONDITIONS',
        dur: 'DURATION', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'DEPLOYED', queued: 'STAGED', standby: 'AT EASE',
        cell: 'SUIT POWER', cycle: 'DAY', shift: 'W-02 // DEPLOYMENT', activeLong: 'BOOTS ON GROUND', offTitle: 'At Ease', tx: 'W-05 // SQUAD COMMS' },
      classes: ['PRIORITY', 'FIELD NOTE', 'STANDING ORDER', 'MORALE']
    },
    slogans: [
      ['Check Your Chute Twice', 'DROP OPERATIONS'], ['The Rain Is Not Tactical Cover', 'FIELD TRAINING'],
      ['Coffee Is A Load-Bearing Ration', 'QUARTERMASTER'], ['Night Optics Do Not Replace Judgment', 'SIGNALS & OPTICS'],
      ['If It Glows Red, Do Not Hug It', 'SAFETY OFFICE'], ['Lost Your Squad? Follow The Music', 'MORALE OFFICE'],
      ['Altitude Is Temporary. Ground Is Forever.', 'DROP OPERATIONS'], ['Report Every Contact, Even Pigeons', 'SIGNALS & OPTICS'],
      ['Your Pod Is Not A Nap Room', 'LOGISTICS'], ['Stay Low. Stay Dry. Stay Alive.', 'FIELD TRAINING'],
      ['The City Remembers Who Helped', 'CIVIL AFFAIRS'], ['Sleep Is Granted, Not Owed', 'COMMAND']
    ]
  },
  grimoire: {
    id: 'grimoire', title: 'Planar Grimoire', blurb: 'An arcane card deck. Gilt frames, jewel-tone gems, a star sigil and a daily draw.',
    company: 'Planar Grimoire', unit: 'TURN 283',
    colors: { ground: '#15132A', ink: '#EDE4CF', accent: '#D9B45A', glow: '#8E5CD9', panel: '#1F1B3A' },
    fonts: { display: 'Cormorant Garamond', mono: 'Cormorant SC' },
    motif: 'grimoire', texture: 'stars', marks: 'none', iconStyle: 'gilded', glyphs: 'grimoire', units: 'fahrenheit', upper: false,
    phrases: [['The', 'Wandering Star'], ['Seer Of', 'Small Hours'], ['Gilded', 'Familiar'], ['Oath Of', 'Embers']],
    morePhrases: [["Keeper", "Of The Uncast"], ["On Loan", "From The Moon"], ["Seal Of", "Quiet Ink"], ["Drawn", "Past The Veil"], ["One", "Conjured Crumb"], ["Due At", "The Moonwell"], ["Under", "A Moth's Wing"], ["Bound", "In Unread Gold"], ["Mirror", "Without A Face"], ["Tea For", "The Cauldron"], ["Lesson", "In Small Stars"]],
    text: {
      school: 'Arcanum of Divination', cardNo: 'VII · LXXVIII', flavor: 'What the stars promise, the patient collect.',
      effect: 'When drawn at dawn, your luck holds until dusk. Draw again tomorrow to renew.',
      foot: 'DRAW AGAIN TOMORROW', homeTop: 'THE GREAT SIGIL', sideL: ['ESSENCE', 'IV'], sideR: ['TURN', '283'],
      caption: 'Draw again tomorrow.', gems: ['#E9E1C8', '#3A7BD5', '#5B4A8A', '#D23A4A', '#2FAE7A']
    },
    codes: { camera: 'SCRY', photos: 'RELIC', maps: 'ATLAS', calendar: 'ALMANAC', phone: 'HORN', messages: 'RAVEN', browser: 'ORACLE', music: 'LYRE', youtube: 'VISION', instagram: 'MIRROR', discord: 'CIRCLE' },
    widget: {
      scriptFont: 'Georgia-Bold', txGraphic: 'stars', archive: true, oddity: 'spell', C: {
        solar: { label: 'SCRYING FEED', offline: 'The Veil Is Thick', day: 'SUNLIGHT REMAINING', night: 'THE WITCHING HOURS', setIn: 'DUSK IN', riseIn: 'DAWN IN' },
        audio: { right: 'AN ENCHANTED AIR', src: 'SPELLSONG // YT MUSIC', metric: 'ENCHANTMENT', tap: 'TAP TO BEGIN THE SONG · BOUND ', foot: 'MIND THE ECHOES',
          lines: ['An Enchanted Melody', 'The Choir Of Candles', 'Hymns For The Hour', 'A Charm In Every Note', 'Bewitching Frequencies', 'Listen Closely, Initiate'] },
        feeds: { right: 'TWO POOLS STIRRING', trace: 'ESSENCE FLOW // NOW', rate: 'PULSE OF ESSENCE', tap: 'TAP A POOL TO GAZE · SPELLBOUND ', foot: 'EVERY GLANCE COSTS ESSENCE', linked: 'BOUND', status: 'WARD OF SIGHT // HOLDING',
          yt: { line: 'Visions In Motion', meters: ['WONDER', 'ESSENCE', 'FOCUS'], tag: 'VISIONS UNENDING', queue: '∞ VISIONS', u1: 'MIN', u2: 'CIRCLE', kv: ['VISIONS QUEUED', 'GAZE HELD', 'TRANCE DEPTH'], curve: 'TRANCE // THIS SITTING', curveR: 'ONE MORE VISION', foot: 'GAZE AS FATE INTENDS' },
          ig: { line: 'The Mirror Of Peers', meters: ['VANITY', 'ENVY', 'SORROW'], tag: 'REFLECTIONS: ENDLESS', kv: ['FACES SEEN', 'FAVOR GAINED', 'SELF-REGARD'], curve: 'COMPARISON // SINCE DAWN', curveR: 'PEAK AT MIDNIGHT · SLEEP FORSWORN', foot: 'LOOK. COMPARE. LONG.' } }
      },
      archiveList: [
        { t: 'The fault, dear Brutus, is not in our stars, but in ourselves.', by: 'SHAKESPEARE · JULIUS CAESAR · 1599' },
        { t: 'There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.', by: 'SHAKESPEARE · HAMLET · 1603' },
        { t: 'Double, double toil and trouble; fire burn and cauldron bubble.', by: 'SHAKESPEARE · MACBETH · 1623' }
      ],
      L: { vid: 'W-06 // THE CRYSTAL', obs: 'W-07 // THE LOOKING GLASS', dc: 'W-09 // THE CIRCLE', solar: 'W-03 // CELESTIAL HOURS', solarBig: 'W-03 // CELESTIAL HOURS + OMENS', audio: 'W-04 // SPELLSONG', feeds: 'W-06 // SCRYING POOLS', status: 'W-01 // THE ARCANIST', next: 'NEXT RITUAL', none: 'No Rituals', noneSub: 'THE STARS ARE QUIET', ext: 'OMENS',
        dur: 'DURATION', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HIGH / LOW', active: 'IN PROGRESS', queued: 'FORETOLD', standby: 'DORMANT',
        cell: 'ESSENCE', cycle: 'TURN', shift: 'W-02 // THE RITUAL', activeLong: 'RITUAL UNDERWAY', offTitle: 'Dormant', tx: 'W-05 // DAILY DRAW' },
      classes: ['MINOR ARCANUM', 'MAJOR ARCANUM', 'OMEN', 'CURSE']
    },
    slogans: [
      ['The Stars Owe You One Favor', 'ORDER OF THE OBSERVATORY'], ['Shuffle Your Plans, Not Your Values', 'THE GAMBLER\'S CODEX'],
      ['Draw Water Before You Draw Swords', 'COLLEGE OF HEALERS'], ['Today Rewards The Patient Hand', 'SCHOOL OF DIVINATION'],
      ['Your Rarest Card Is Rest', 'COLLEGE OF HEALERS'], ['Bluff Gently. Win Kindly.', 'THE GAMBLER\'S CODEX'],
      ['An Old Rival Will Reappear', 'SCHOOL OF DIVINATION'], ['Spend Wisely. Recharge Often.', 'GUILD OF ALCHEMISTS'],
      ['The Moon Is Watching Your Discards', 'ORDER OF THE OBSERVATORY'], ['Every Deck Has One Wild Card', 'THE TRICKSTER\'S ALMANAC'],
      ['Fortune Favors The Prepared Deck', 'GUILD OF ALCHEMISTS'], ['Tonight, Play The Long Game', 'THE TRICKSTER\'S ALMANAC']
    ]
  },
  deeprange: {
    id: 'deeprange', title: 'Deep Range', blurb: 'A long-range tracking display. Black glass, red contact frames, a yellow trajectory and a blue planet below.', edition: 'original',
    company: 'Deep Range', unit: 'RELAY 07',
    colors: { ground: '#050608', ink: '#FFE14A', accent: '#FF3B30', glow: '#2340FF', panel: '#0B0D10', alert: '#3DFF8A' },
    fonts: { display: 'Archivo', mono: 'Share Tech Mono' },
    motif: 'orbital', texture: 'scan', marks: 'none', iconStyle: 'tracker', glyphs: 'deeprange', units: 'fahrenheit', upper: true,
    phrases: [['Contact', 'Lost'], ['Signal', 'Acquired'], ['Return', 'Window'], ['Deep', 'Range']],
    text: {
      topL: 'TRACKING 12 CONTACTS', coords: 'RANGE 0.4 AU // RELAY 07', yearLabel: 'YEAR', year: 'auto',
      codeA: 'R 07-KX', codeB: 'DR 0X283', fine: 'A E0- 12  9X  00', foot: 'DEEP RANGE // RELAY 07',
      homeTop: 'PROXIMITY ALERT', caption: 'LOSS OF SIGNAL IMMINENT', countdown: 'T-00:00:47'
    },
    codes: { camera: 'SCAN', photos: 'LOG', maps: 'WPT', calendar: 'YEAR', phone: 'PING', messages: 'COMM', browser: 'ORBIT', music: 'FREQ', youtube: 'FEED', instagram: 'LOCK', discord: 'RELAY' },
    widget: {
      scriptFont: 'AvenirNext-Heavy', txGraphic: 'trajectory', archive: true, oddity: 'decoder', C: {
        solar: { label: 'SOLAR TELEMETRY', offline: 'Telemetry Lost', day: 'LIGHT WINDOW', night: 'DARK WINDOW', setIn: 'LOSS OF LIGHT IN', riseIn: 'ACQUISITION IN' },
        audio: { right: 'CH 08 · RELAY 07', src: 'CARRIER // YT MUSIC', metric: 'SIGNAL', tap: 'TAP TO LOCK ON · CARRIER ', foot: 'DO NOT CHANGE FREQUENCY',
          lines: ['Carrier Wave Locked', 'Music On Relay 07', 'Downlink Stable', 'Listening On All Bands', 'Frequency Acquired', 'Hold This Channel'] },
        feeds: { right: '2 DOWNLINKS ACTIVE', trace: 'RECEIVER NOISE // LIVE', rate: 'PING RATE', tap: 'TAP A LINK TO ACQUIRE · LOCK ', foot: 'ATTENTION IS FINITE. CONTENT IS NOT.', linked: 'ACQUIRED', status: 'RELAY 07 // LOCKED',
          yt: { line: 'Video Downlink', meters: ['SIGNAL', 'CURIOSITY', 'FOCUS'], tag: 'DOWNLINK: CONTINUOUS', queue: '∞ PASSES', u1: 'MIN', u2: 'PASS', kv: ['QUEUE', 'DWELL TIME', 'PASS DEPTH'], curve: 'SIGNAL STRENGTH // PASS', curveR: 'ONE MORE PASS', foot: 'TRACKING CONTENT' },
          ig: { line: 'Contact Chatter', meters: ['PINGS', 'ECHO', 'STATIC'], tag: 'PINGS: UNCOUNTED', kv: ['CONTACTS PINGED', 'REPLIES', 'SIGNAL SELF'], curve: 'PING RATE // 24H', curveR: 'PEAK 23:00 · NO RESPONSE', foot: 'PING. WAIT. PING.' } }
      },
      L: { vid: 'W-06 // VIDEO DOWNLINK', obs: 'W-07 // IMAGE INTERCEPTS', dc: 'W-09 // RELAY NET', solar: 'W-03 // SOLAR WINDOW', solarBig: 'W-03 // SOLAR WINDOW + ATMOS', audio: 'W-04 // CARRIER WAVE', feeds: 'W-06 // DOWNLINKS', status: 'W-01 // CONTACT STATUS', next: 'NEXT RENDEZVOUS', none: 'No Contacts', noneSub: 'PASSIVE LISTEN', ext: 'SURFACE',
        dur: 'WINDOW', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'IN CONTACT', queued: 'INBOUND', standby: 'LISTENING',
        cell: 'RESERVE', cycle: 'DAY', shift: 'W-02 // WINDOW', activeLong: 'WINDOW OPEN', offTitle: 'Listening', tx: 'W-05 // DEEP RANGE COMMS' },
      classes: ['CONTACT', 'PING', 'ECHO', 'LOSS OF SIGNAL']
    },
    slogans: [
      ['Contact Lost Is Not Contact Gone', 'RANGE CONTROL'], ['We Hear You. Do Not Repeat.', 'SIGNAL ANALYSIS'],
      ['Your Last Ping Was Logged', 'TELEMETRY'], ['Nothing Out Here Is Abandoned', 'SALVAGE RIGHTS'],
      ['Return Window Closes At Dawn', 'FLIGHT DYNAMICS'], ['The Dark Is Mostly Paperwork', 'RANGE CONTROL'],
      ['Echo Detected. Ignore Echo.', 'SIGNAL ANALYSIS'], ['Drift Is A Direction Too', 'NAVIGATION'],
      ['All Lost Contacts Are Billed', 'ACCOUNTS RECEIVABLE'], ['Stay On Frequency', 'COMMS'],
      ['The Relay Remembers Your Voice', 'RELAY OPS'], ['If It Answers, Do Not Answer Back', 'PROTOCOL OFFICE']
    ]
  },
  rabbit: {
    id: 'rabbit', title: 'White Rabbit', blurb: 'A legion of gentleman thieves. Pearl and lilac, magenta lasers, a leaping rabbit and a calling card left at every scene.',
    company: 'White Rabbit', unit: 'CELL 07',
    colors: { ground: '#E7E0FA', ink: '#2A2340', accent: '#E8338C', glow: '#A99BF0', panel: '#F7F4FF', alert: '#FF5AA8' },
    fonts: { display: 'Bodoni Moda', mono: 'DM Mono' },
    motif: 'rabbit', texture: 'dots', marks: 'none', iconStyle: 'pearl', glyphs: 'rabbit', units: 'fahrenheit', upper: false,
    phrases: [["What's Yours", 'Is Mine'], ['Catch Me', 'If You Can'], ['Before I', 'Catch You'], ['Seven Heirlooms,', 'One Night']],
    morePhrases: [["Invitation", "Optional"], ["Velvet Gloves,", "Clean Exit"], ["Reserve The Car,", "Not A Seat"], ["Mind The Lasers,", "Save Silk"], ["The Winning Bid", "Was A Nod"], ["After The Waltz,", "The Vault"], ["A Calling Card,", "No Address"], ["Nothing Missing", "But Proof"], ["Lift The Crown,", "Leave Dust"], ["Blame The", "Copycat"], ["Safehouse Tea", "For Two"]],
    text: {
      tagL: 'LEGION OF THIEVES · CELL 07', tagR: 'WHITE RABBIT', sub: 'Nothing was taken. Everything is gone.', foot: 'WHITE RABBIT // CALLING CARD 07',
      homeTop: 'SEVEN HEIRLOOMS · ONE NIGHT', caption: 'We were never here.'
    },
    codes: { camera: 'CASE', photos: 'LOOT', maps: 'ROUTE', calendar: 'JOB', phone: 'BURNER', messages: 'CARD', browser: 'VAULT', music: 'MIX', youtube: 'REEL', instagram: 'MARKS', discord: 'WARREN' },
    widget: {
      scriptFont: 'Didot', txGraphic: 'helix', archive: true, oddity: 'heist', C: {
        solar: { label: 'COVER WATCH', offline: 'Lost In The Clouds', day: 'EXPOSED · DAYLIGHT LEFT', night: 'UNDER COVER OF DARK', setIn: 'COVER OF DARK IN', riseIn: 'EXPOSED AGAIN IN' },
        audio: { right: 'SOFT STEPS ONLY', src: 'GETAWAY MIX // YT MUSIC', metric: 'NERVE', tap: 'TAP TO PLAY IT COOL · ', foot: 'NOBODY HEARD A THING',
          lines: ['Music For A Clean Getaway', 'The Vault Opens At Midnight', 'A Waltz Past The Lasers', 'Soft Steps, Loud Bass', 'Play It Cool', 'Nobody Heard A Thing'] },
        feeds: { right: 'TWO MARKS CASED', trace: 'NERVE // LIVE', tap: 'TAP A MARK TO CASE · ', foot: "WHAT'S YOURS IS MINE", linked: 'CASED', status: 'CALLING CARD // READY', rate: 'PULSE',
          yt: { line: 'Casing Footage', meters: ['NERVE', 'PATIENCE', 'FOCUS'], tag: 'ONE MORE LOOP', queue: '∞ ANGLES', u1: 'MIN', u2: 'FLOOR', kv: ['QUEUE', 'TIME CASED', 'FLOOR'], curve: 'GUARD ROTATION // TONIGHT', curveR: 'BLIND SPOT FOUND', foot: 'WATCH. WAIT. TAKE.' },
          ig: { line: 'The Marks', meters: ['ENVY', 'SPARKLE', 'WORRY'], tag: 'ALL THAT GLITTERS', kv: ['MARKS', 'JEWELS SPOTTED', 'TAKEN'], curve: 'GLITTER // TODAY', curveR: 'PEAK AT THE GALA', foot: 'LOOK. COVET. TAKE.' } }
      },
      L: { vid: 'W-06 // SURVEILLANCE REEL', obs: 'W-07 // THE MARKS', dc: 'W-09 // THE WARREN', solar: 'W-03 // COVER WATCH', solarBig: 'W-03 // COVER WATCH + WEATHER', audio: 'W-04 // GETAWAY MIX', feeds: 'W-06 // TWO MARKS',
        status: 'W-01 // THE JOB', next: 'NEXT JOB', none: 'No Jobs Tonight', noneSub: 'LAYING LOW', ext: 'COVER',
        dur: 'WINDOW', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'IN PROGRESS', queued: 'CASED', standby: 'LAYING LOW',
        cell: 'NERVE', cycle: 'NIGHT', shift: 'W-02 // GETAWAY', activeLong: 'ON THE JOB', offTitle: 'Laying Low', tx: 'W-05 // CALLING CARD' },
      classes: ['CALLING CARD', 'HEIST', 'FOR THE LEGION', 'BURN AFTER READING'],
      archiveList: [
        { t: 'Arsène Lupin, gentleman-burglar, will return when the furniture is genuine.', by: 'MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907' },
        { t: 'What a pity that I am not an honest man!', by: 'MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907' },
        { t: 'I shall not be present at my trial.', by: 'MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907' },
        { t: 'When I wish to escape I shall not require any assistance.', by: 'MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907' },
        { t: 'It is I, always I, only I.', by: 'MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907' }
      ]
    },
    slogans: [
      ["What's Yours Is Mine", 'THE LEGION'], ['Catch Me If You Can', 'FIELD OPERATIONS'], ['We Were Never Here', 'CLEANUP CREW'],
      ['Every Lock Is A Question', 'ENTRY SPECIALISTS'], ['Leave The Card. Take The Rest.', 'CALLING CARDS'], ['Seven Heirlooms. One Night.', 'THE ARCHIVE'],
      ['Security Is A Suggestion', 'ENTRY SPECIALISTS'], ['Anyone Can Wear The Ears', 'RECRUITMENT'], ['The Gala Never Saw Us Leave', 'THE ARCHIVE'],
      ['Ears Up. Hands Quick.', 'FIELD OPERATIONS'], ['Copycats Welcome. Rivals Warned.', 'THE LEGION'], ['Gone Before The Alarm', 'GETAWAY']
    ]
  },
  neon: {
    id: 'neon', title: 'Neon District', blurb: 'A hyper-capitalist neon dystopia. Megatowers, a holo-koi, corporate billboards, signage in an invented script and umbrellas in the rain.',
    company: 'Sable Dynamics', unit: 'D-09',
    colors: { ground: '#0A0614', ink: '#F2F0FF', accent: '#FF2E88', glow: '#00F0FF', panel: '#140C24', alert: '#FCEE0A' },
    fonts: { display: 'Orbitron', mono: 'Share Tech Mono' },
    motif: 'neon', texture: 'scan', marks: 'none', iconStyle: 'neon', glyphs: 'cyber', units: 'fahrenheit', upper: true,
    phrases: [['Buy Now,', 'Pay Forever'], ['Breathe', 'Premium Air'], ['Your Debt Is', 'Our Future'], ['Sleep Is A', 'Subscription']],
    morePhrases: [["Streetlight", "By The Hour"], ["Terms Apply", "Above Ground"], ["Sable Owns", "The Skyline"], ["Umbrella", "Ads Inside"], ["Elevators", "Sell Access"], ["Queue Here", "For Silence"], ["Overtime", "Has A Lobby"], ["Firewall", "At The Door"], ["Pawn A Badge", "Keep A Name"], ["Public Space", "Private Rate"], ["Cash Talks,", "Walls Listen"]],
    text: { tagL: 'SABLE DYNAMICS // DISTRICT 09', tagR: 'NET: ONLINE', sub: 'Terms apply. Terms always apply.', foot: 'NEON DISTRICT // D-09 // 24-7', homeTop: 'OPEN 24/7', caption: 'Mind the drones.' },
    codes: { camera: 'OPTIC', photos: 'MEM', maps: 'GRID', calendar: 'GIGS', phone: 'LINK', messages: 'MSG', browser: 'NET', music: 'RADIO', youtube: 'STREAM', instagram: 'CHROME', discord: 'NETBAR' },
    widget: {
      scriptFont: 'Futura-CondensedExtraBold', txGraphic: 'sync', archive: true, oddity: 'market', C: {
        solar: { label: 'SMOG WATCH', offline: 'Signal Jammed', day: 'NEON OFF IN · DAYLIGHT', night: 'NIGHT SHIFT', setIn: 'NIGHT SHIFT IN', riseIn: 'NEON OFF IN' },
        audio: { right: 'FREQ 88.9 · PIRATE', src: 'PIRATE RADIO // YT MUSIC', metric: 'HYPE', tap: 'TAP TO JACK IN · LIVE ', foot: 'DON\'T TRUST THE DJ', lines: ['Pirate Signal, Unlicensed', 'Synths Over The Rain', 'Bass For The Night Shift', 'Broadcast From A Rooftop', 'Static Is Also Music', 'Chrome Hearts, Loud'] },
        feeds: { right: '2 FEEDS JACKED', trace: 'NEURAL NOISE // LIVE', tap: 'TAP A FEED TO JACK IN · ', foot: 'ATTENTION IS CURRENCY', linked: 'JACKED', status: 'LINK // ENCRYPTED', rate: 'SPIKE',
          yt: { line: 'Holo-Streams', meters: ['HYPE', 'GLITCH', 'FOCUS'], tag: 'AUTOPLAY: FOREVER', queue: '∞ STREAMS', u1: 'MIN', u2: 'LAYER', kv: ['QUEUE', 'SCREEN TIME', 'LAYER'], curve: 'HYPE // TONIGHT', curveR: 'BUFFERING DREAMS', foot: 'STAY TUNED' },
          ig: { line: 'Chrome Gallery', meters: ['ENVY', 'CHROME', 'DOUBT'], tag: 'FILTERED FOREVER', kv: ['FOLLOWERS', 'UPGRADES SEEN', 'REAL FACES'], curve: 'ENVY // 24H', curveR: 'PEAK AT 03:00', foot: 'SCROLL. COMPARE. UPGRADE.' } }
      },
      L: { vid: 'W-06 // HOLO-STREAM', obs: 'W-07 // CHROME GALLERY', dc: 'W-09 // THE NET BAR', solar: 'W-03 // SMOG INDEX', solarBig: 'W-03 // SMOG INDEX + ATMOS', audio: 'W-04 // PIRATE RADIO', feeds: 'W-06 // FEEDJACK',
        status: 'W-01 // RUNNER STATUS', next: 'NEXT GIG', none: 'No Gigs', noneSub: 'OFF THE GRID', ext: 'STREET',
        dur: 'RUNTIME', state: 'STATE', feels: 'FEELS', hilo: 'HI / LO', active: 'JACKED IN', queued: 'QUEUED', standby: 'IDLE',
        cell: 'BATTERY', cycle: 'SHIFT', shift: 'W-02 // GIG TIMER', activeLong: 'ON THE GIG', offTitle: 'Off The Grid', tx: 'W-05 // HOLO-AD' },
      classes: ['SPONSORED', 'PRIORITY', 'GLITCHED', 'CORP MEMO'],
      archiveList: [
        { t: 'There is no security against the ultimate development of mechanical consciousness.', by: 'SAMUEL BUTLER · EREWHON · 1872' },
        { t: 'Day by day the machines are gaining ground upon us.', by: 'SAMUEL BUTLER · DARWIN AMONG THE MACHINES · 1863' },
        { t: 'The Machine develops, but not on our lines. The Machine proceeds, but not to our goal.', by: 'E. M. FORSTER · THE MACHINE STOPS · 1909' }
      ]
    },
    slogans: [['Upgrade Or Get Upgraded', 'CHROME SALES'], ['Your Data Looks Delicious', 'AD NETWORK'], ['Sleep Is A Subscription', 'WELLNESS DIV'], ['Rain Check Denied', 'LANDLORD BOT'],
      ['Trust The Corp. The Corp Trusts No One.', 'PUBLIC RELATIONS'], ['Glitch Responsibly', 'NET SAFETY'], ['Neon Is Cheaper Than Daylight', 'CITY POWER'], ['All Streets Lead To Overtime', 'HR CORE'],
      ['Feel Something. Buy Something.', 'AD NETWORK'], ['Your Face Is Our Password', 'SECURITY'], ['Smile, You Are Being Scanned', 'SECURITY'], ['Night Shift Never Ends', 'HR CORE']]
  },
  vapor: {
    id: 'vapor', title: 'Vapor Plaza', blurb: 'Vaporwave mallsoft. A striped sunset, a neon grid, palm trees, a marble column and a little window from 1995.',
    company: 'Vapor Plaza', unit: 'MALL 95',
    colors: { ground: '#2A0F55', ink: '#FFF2FF', accent: '#FF71CE', glow: '#01CDFE', panel: '#3B1873', alert: '#FFFB96' },
    fonts: { display: 'Righteous', mono: 'VT323' },
    motif: 'vapor', texture: 'scan', marks: 'none', iconStyle: 'win95', glyphs: 'vapor', units: 'fahrenheit', upper: false,
    phrases: [['Eternal', 'Sunset'], ['Welcome To', 'The Plaza'], ['Nothing Is', 'Real Here'], ['Forever', 'Nineteen 95']],
    morePhrases: [["Lost Year?", "Ask At Desk"], ["Fountain", "Change Only"], ["Escalator", "To Nowhere"], ["Vacancies", "Still Lit"], ["Food Court", "For One"], ["On Hold", "Since 1995"], ["Soft Jazz", "Hard Floors"], ["Rewind", "The Weekend"], ["Mannequins", "On Break"], ["Arcade", "Afterglow"], ["Parking", "Unvalidated"]],
    text: { tagL: 'VAPOR PLAZA · LEVEL 2', tagR: 'OPEN', sub: 'Please enjoy the fountain.', foot: 'VAPOR PLAZA // MALL 95 // FOREVER', homeTop: 'NOW ENTERING THE PLAZA', caption: 'Elevator music, forever.' },
    codes: { camera: 'CAM.EXE', photos: 'PICS', maps: 'MAP', calendar: 'DATE', phone: 'CALL', messages: 'CHAT', browser: 'WEB', music: 'TAPE', youtube: 'VHS', instagram: 'POLAROID', discord: 'CHATRM' },
    widget: {
      scriptFont: 'Futura-Bold', txGraphic: 'route', archive: false, oddity: 'mall', C: {
        solar: { label: 'SUNSET WATCH', offline: 'Signal Lost In 1995', day: 'SUNSET FOREVER', night: 'AFTER HOURS', setIn: 'SUNSET IN', riseIn: 'OPENING IN' },
        audio: { right: 'ON THE AIR', src: 'MALLSOFT FM // YT MUSIC', metric: 'CHILL', tap: 'TAP TO TUNE IN · ', foot: 'SMOOTH AND ETERNAL', lines: ['Smooth Jazz For Escalators', 'Fountain Ambience, Side B', 'Elevator Music Forever', 'Food Court Serenade', 'Sunset On Cassette', 'Hold Music, Remastered'] },
        feeds: { right: '2 CHANNELS', trace: 'STATIC // LIVE', tap: 'TAP A CHANNEL · ', foot: 'REWIND TO 1995', linked: 'TUNED', status: 'SIGNAL // VHS', rate: 'TRACKING',
          yt: { line: 'VHS Tapes', meters: ['NOSTALGIA', 'STATIC', 'FOCUS'], tag: 'BE KIND, REWIND', queue: '∞ TAPES', u1: 'MIN', u2: 'TAPE', kv: ['QUEUE', 'TAPE TIME', 'TAPE'], curve: 'TRACKING // TONIGHT', curveR: 'ADJUST TRACKING', foot: 'PRESS PLAY' },
          ig: { line: 'Postcards', meters: ['LONGING', 'GLOW', 'PALMS'], tag: 'WISH YOU WERE HERE', kv: ['POSTCARDS', 'SUNSETS', 'PALM TREES'], curve: 'AESTHETIC // TODAY', curveR: 'PEAK AT SUNSET', foot: 'SEND ONE TO 1995' } }
      },
      L: { vid: 'W-06 // VHS', obs: 'W-07 // POSTCARDS', dc: 'W-09 // CHAT ROOM', solar: 'W-03 // ETERNAL SUNSET', solarBig: 'W-03 // ETERNAL SUNSET + WEATHER', audio: 'W-04 // MALLSOFT FM', feeds: 'W-06 // TWO CHANNELS',
        status: 'W-01 // PLAZA STATUS', next: 'NOW SHOWING', none: 'Nothing Scheduled', noneSub: 'ENJOY THE ATRIUM', ext: 'ATRIUM',
        dur: 'RUNTIME', state: 'STATUS', feels: 'FEELS', hilo: 'HI / LO', active: 'NOW', queued: 'SOON', standby: 'IDLE',
        cell: 'POWER', cycle: 'DAY', shift: 'W-02 // LOADING', activeLong: 'NOW LOADING', offTitle: 'Screensaver Mode', tx: 'W-05 // MESSAGE FROM 1995' },
      classes: ['SPECIAL OFFER', 'ANNOUNCEMENT', 'LOST AND FOUND', 'SYSTEM'], archiveList: []
    },
    slogans: [['Please Enjoy The Fountain', 'MALL MANAGEMENT'], ['All Stores Open Forever', 'MALL MANAGEMENT'], ['Your Call Is Important To Us', 'CUSTOMER CARE'], ['Smooth Jazz Is A Lifestyle', 'MALLSOFT FM'],
      ['Buy One, Remember Two', 'GIFT SHOP'], ['The Escalator Goes Up Forever', 'FACILITIES'], ['Have A Pleasant Afternoon', 'CUSTOMER CARE'], ['Free Samples Of Nostalgia', 'FOOD COURT'],
      ['Please Do Not Feed The Dolphins', 'AQUARIUM'], ['This Moment Is On Sale', 'GIFT SHOP'], ['Thank You For Shopping', 'MALL MANAGEMENT'], ['Insert Disk 2', 'SYSTEM']]
  },
  wild: {
    id: 'wild', title: 'Wildwood', blurb: 'A naturalist\'s field journal. Sage paper, fern fronds, mushrooms, birdsong and pressed leaves.',
    company: 'Wildwood', unit: 'TRAIL 03',
    colors: { ground: '#E7EEDC', ink: '#1F3A2B', accent: '#C2662D', glow: '#6E9E4C', panel: '#F6F8F0', alert: '#E3B341' },
    fonts: { display: 'Fraunces', mono: 'DM Mono' },
    motif: 'botanical', texture: 'dots', marks: 'none', iconStyle: 'leaf', glyphs: 'nature', units: 'fahrenheit', upper: false,
    phrases: [['Slow Down,', 'Look Closer'], ['Grow Where', 'You Are'], ['Every Path', 'Is A Story'], ['Take Only', 'Photographs']],
    morePhrases: [["Turn A", "Fresh Page"], ["Wait For", "The Wren"], ["At The Log", "Sit Awhile"], ["Mud Keeps", "Paw Prints"], ["Count The", "Wingbeats"], ["Leave Room", "For Roots"], ["Rain Ends,", "Moss Shines"], ["Old Acorns", "New Oaks"], ["Creek Bend", "Quiet Seat"], ["One Fern,", "Many Notes"], ["Dusk Comes", "With Foxes"]],
    text: { tagL: 'WILDWOOD · FIELD NOTES', tagR: 'PLATE 03', sub: 'Collected on the morning trail.', foot: 'WILDWOOD // TRAIL 03', homeTop: 'THE FOREST FLOOR', caption: 'Listen for the wren.' },
    codes: { camera: 'LOOK', photos: 'PRESS', maps: 'TRAIL', calendar: 'SEASON', phone: 'CALL', messages: 'NOTE', browser: 'GROVE', music: 'SONG', youtube: 'REEL', instagram: 'BLOOM', discord: 'FIRE' },
    widget: {
      scriptFont: 'Georgia-Bold', txGraphic: 'route', archive: true, oddity: 'species', C: {
        solar: { label: 'DAYLIGHT', offline: 'Under The Canopy', day: 'DAYLIGHT LEFT', night: 'NIGHTFALL', setIn: 'SUNSET IN', riseIn: 'SUNRISE IN' },
        audio: { right: 'DAWN CHORUS', src: 'BIRDSONG // YT MUSIC', metric: 'CALM', tap: 'TAP TO LISTEN · ', foot: 'LISTEN FOR THE WREN', lines: ['A Morning By The Creek', 'Wind In The Pines', 'Rain On Broad Leaves', 'The Dawn Chorus', 'Crickets At Dusk', 'Songs For The Trail'] },
        feeds: { right: 'TWO TRAILS', trace: 'FOREST PULSE // NOW', tap: 'TAP A TRAIL TO WANDER · ', foot: 'LEAVE NO TRACE', linked: 'WANDERING', status: 'COMPASS // TRUE', rate: 'PULSE',
          yt: { line: 'Nature Reel', meters: ['WONDER', 'CALM', 'FOCUS'], tag: 'ONE MORE VALLEY', queue: '∞ TRAILS', u1: 'MIN', u2: 'RIDGE', kv: ['QUEUE', 'TIME OUTSIDE', 'RIDGE'], curve: 'WONDER // TODAY', curveR: 'GO OUTSIDE', foot: 'THEN GO OUTSIDE' },
          ig: { line: 'Specimens', meters: ['BLOOM', 'MOSS', 'CURIOSITY'], tag: 'PRESSED AND LABELED', kv: ['SPECIES', 'BLOOMS', 'FERNS'], curve: 'BLOOMS // THIS WEEK', curveR: 'PEAK AT DAWN', foot: 'LOOK. LABEL. LET BE.' } }
      },
      L: { vid: 'W-06 // NATURE REEL', obs: 'W-07 // SPECIMENS', dc: 'W-09 // THE CAMPFIRE', solar: 'W-03 // DAYLIGHT', solarBig: 'W-03 // DAYLIGHT + WEATHER', audio: 'W-04 // BIRDSONG', feeds: 'W-06 // TWO TRAILS',
        status: 'W-01 // FIELD JOURNAL', next: 'NEXT OUTING', none: 'A Free Day', noneSub: 'GO FOR A WALK', ext: 'WEATHER',
        dur: 'LENGTH', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'UNDERWAY', queued: 'SOON', standby: 'RESTING',
        cell: 'ENERGY', cycle: 'DAY', shift: 'W-02 // TRAIL TIMER', activeLong: 'ON THE TRAIL', offTitle: 'Resting By The Creek', tx: 'W-05 // FIELD NOTE' },
      classes: ['OBSERVATION', 'FIELD NOTE', 'SEASONAL', 'REMINDER'],
      archiveList: [
        { t: 'In wildness is the preservation of the world.', by: 'HENRY DAVID THOREAU · WALKING · 1862' },
        { t: 'The mountains are calling and I must go.', by: 'JOHN MUIR · LETTER · 1873' },
        { t: 'In every walk with nature one receives far more than he seeks.', by: 'JOHN MUIR · STEEP TRAILS · 1918' },
        { t: 'I went to the woods because I wished to live deliberately.', by: 'HENRY DAVID THOREAU · WALDEN · 1854' }
      ]
    },
    slogans: [['Slow Is A Speed', 'TRAIL CREW'], ['Moss Grows On Patience', 'FIELD NOTES'], ['Leave It Better', 'TRAIL CREW'], ['Every Leaf Is A Letter', 'HERBARIUM'],
      ['Listen Before You Look', 'BIRD COUNT'], ['Rain Is Just Slow Gardening', 'GREENHOUSE'], ['Small Things Hold Up The World', 'SOIL SURVEY'], ['The Creek Knows The Way', 'TRAIL CREW'],
      ['Stay On The Path, Mostly', 'RANGER STATION'], ['Mushrooms Are The Internet', 'SOIL SURVEY'], ['Sit. Wait. The Deer Will Come.', 'FIELD NOTES'], ['Pick Up Three Things', 'TRAIL CREW']]
  },
  odds: {
    id: 'odds', title: 'Long Odds', blurb: 'A prediction market on steroids. Neon YES and NO, 100x leverage, whale alerts, live bets and a countdown on everything.',
    company: 'Long Odds Exchange', unit: 'MKT-77',
    colors: { ground: '#06070B', ink: '#F2F4F8', accent: '#8B5CF6', glow: '#00FF88', panel: '#10121A', alert: '#FF2D55' },
    fonts: { display: 'Archivo', mono: 'JetBrains Mono' },
    motif: 'market', texture: 'scan', marks: 'none', iconStyle: 'contract', glyphs: 'market', units: 'fahrenheit', upper: true,
    phrases: [['Will Today', 'Happen Twice?'], ['Does The Void', 'Take Bets?'], ['Will You Remember', 'This Tuesday?'], ['Is Tomorrow', 'Priced In?']],
    morePhrases: [["Can Silence", "Outbid Noise?"], ["Who Sets", "Time's Price?"], ["Has Forever", "Reached Zero?"], ["Could A Hunch", "Go Bankrupt?"], ["Are Unlived Lives", "Liquid Yet?"], ["Did The Future", "Default?"], ["Would An Echo", "Earn A Yield?"], ["Which Self", "Keeps Profit?"], ["If Doubt Rallies,", "Who Buys?"], ["Where Does Luck", "Settle Up?"], ["How Much Nothing", "Buys A Maybe?"]],
    text: { tagL: 'LONG ODDS // DEGEN EXCHANGE', tagR: 'LIVE', sub: 'Not financial advice. Barely advice.', foot: 'LONG ODDS // 24/7/365 // NO BRAKES', homeTop: 'WHALES ARE MOVING', caption: 'Bet small. Dream huge.' },
    codes: { camera: 'SCOUT', photos: 'PNL', maps: 'ROUTE', calendar: 'EXPIRY', phone: 'WHALE', messages: 'ALPHA', browser: 'MARKETS', music: 'PUMP', youtube: 'REPLAY', instagram: 'HYPE', discord: 'PIT' },
    widget: {
      scriptFont: 'AvenirNext-Heavy', txGraphic: 'sync', archive: true, oddity: 'bet', C: {
        solar: { label: 'DAYLIGHT PERPS', offline: 'Market Halted', day: 'DAYLIGHT · LONG 50X', night: 'AFTER HOURS · SHORT', setIn: 'LIQUIDATES IN', riseIn: 'MARKET OPENS IN' },
        audio: { right: 'DEGEN RADIO', src: 'PUMP // YT MUSIC', metric: 'HYPE', tap: 'TAP TO APE IN · ', foot: 'TURN IT UP. SIZE IT DOWN.',
          lines: ['Bangers For Bull Runs', 'Music To Get Liquidated To', 'Green Candles, Loud Bass', 'The 100x Playlist', 'Whale Songs (Literal)', 'Pump It, Then Hedge It'] },
        feeds: { right: 'TWO PUMPS', trace: 'HYPE // LIVE', tap: 'TAP TO APE IN · ', foot: 'EVERYTHING IS A MARKET', linked: 'APED', status: 'ORDER BOOK // MELTING', rate: 'VOLUME',
          yt: { line: 'Watch & Bet', meters: ['HYPE', 'FOMO', 'FOCUS'], tag: '▲ PUMPING +34%', queue: '∞ MARKETS', u1: 'MIN', u2: 'X', kv: ['QUEUE', 'TIME WATCHED', 'LEVERAGE'], curve: 'HYPE // SESSION', curveR: 'TO THE MOON', foot: 'WATCH. BET. REPEAT.' },
          ig: { line: 'Hype Index', meters: ['FOMO', 'HYPE', 'COPE'], tag: '▼ DUMPING -12%', kv: ['POSTS PRICED', 'MOONING', 'REKT'], curve: 'HYPE // 24H', curveR: 'PEAK AT 3AM', foot: 'SCROLL. BET. SCROLL.' } }
      },
      L: { vid: 'W-06 // WATCH & BET', obs: 'W-07 // HYPE INDEX', dc: 'W-09 // THE PIT', solar: 'W-03 // DAYLIGHT PERPS', solarBig: 'W-03 // DAYLIGHT PERPS + WEATHER', audio: 'W-04 // DEGEN RADIO', feeds: 'W-06 // TWO PUMPS',
        status: 'W-01 // LIFE, LEVERAGED', next: 'NEXT POSITION', none: 'No Open Positions', noneSub: 'FLAT. FOR NOW.', ext: 'WEATHER',
        dur: 'TERM', state: 'STATE', feels: 'FEELS LIKE', hilo: 'HI / LO', active: 'LIVE', queued: 'OPEN', standby: 'FLAT',
        cell: 'BATTERY', cycle: 'SESSION', shift: 'W-02 // RESOLVES', activeLong: 'LIVE', offTitle: 'Market Closed', tx: 'W-05 // HOT TAKE' },
      classes: ['HOT TAKE', 'WHALE ALERT', 'LOCK OF THE DAY', 'ALPHA LEAK'], archiveList: []
    },
    slogans: [['Ape In, Think Later', 'DEGEN DESK'], ['Fortune Favors The Leveraged', 'RISK OFFICE (UNSTAFFED)'], ['Liquidation Is Just A Plot Twist', 'CLEARING HOUSE'], ['Every Coin Flip Is A Market', 'MARKET MAKING'],
      ['Sleep Is For Flat Positions', 'NIGHT DESK'], ['100x Or Go Home', 'LEVERAGE DEPT'], ['The Whales Are Hungry', 'WHALE WATCH'], ['Your Gut Is A Data Feed', 'QUANT DESK'],
      ['Buy The Rumor. Sell The Nap.', 'TRADING FLOOR'], ['Odds Are Just Vibes With Decimals', 'RESEARCH'], ['Not Financial Advice. Barely Advice.', 'COMPLIANCE'], ['Diamond Hands, Paper Plans', 'STRATEGY'],
      ['Number Go Up', 'MARKETING'], ['There Is Always A Bigger Whale', 'WHALE WATCH'], ['The House Always Watches', 'SURVEILLANCE'], ['Resolve Fast, Regret Faster', 'CLEARING HOUSE'],
      ['LFG (Statistically)', 'MORALE'], ['Every Morning Is A Market Open', 'NIGHT DESK'], ['Copium Is Not A Hedge', 'RISK OFFICE (UNSTAFFED)'], ['Bet Small. Dream Huge.', 'COMPLIANCE'],
      ['Your Alarm Clock Has Odds', 'FORECASTING'], ['Green Candles Are A Love Language', 'MARKETING'], ['Exit Liquidity Is A Personality', 'TRADING FLOOR'], ['The Spread Never Sleeps', 'MARKET MAKING'],
      ['Long Coffee, Short Meetings', 'STRATEGY'], ['Rekt Is A Rite Of Passage', 'MORALE'], ['Price It Or It Didn\'t Happen', 'RESEARCH'], ['Max Pain, Max Gain', 'LEVERAGE DEPT'],
      ['Moon Or Bust (Mostly Bust)', 'FORECASTING'], ['Hedge Your Hedges', 'RISK OFFICE (UNSTAFFED)']]
  }
};

const DISPLAY_FONTS = [['Bodoni Moda', 600], ['Orbitron', 700], ['Righteous', 400], ['Newsreader', 300], ['Shippori Mincho B1', 800], ['IM Fell English', 400], ['Cormorant Garamond', 700], ['Fraunces', 700], ['Oxanium', 700], ['Space Grotesk', 600], ['Archivo', 800]];
const MONO_FONTS = ['VT323', 'IBM Plex Mono', 'Barlow Condensed', 'IM Fell English SC', 'Cormorant SC', 'Share Tech Mono', 'DM Mono', 'JetBrains Mono'];
const SCRIPT_FONTS = { 'Newsreader': 'Baskerville', 'Shippori Mincho B1': 'HiraMinProN-W6', 'IM Fell English': 'Baskerville-SemiBold', 'Cormorant Garamond': 'Georgia-Bold', 'Oxanium': 'AvenirNextCondensed-DemiBold', 'Fraunces': 'Georgia-Bold', 'Space Grotesk': 'AvenirNext-DemiBold', 'Archivo': 'AvenirNext-Heavy', 'Bodoni Moda': 'Didot', 'Orbitron': 'Futura-CondensedExtraBold', 'Righteous': 'Futura-Bold' };
const DEVICES = [
  ['iPhone 12 mini / 13 mini', 1080, 2340],
  ['iPhone 12, 13, 14, 12 Pro, 13 Pro', 1170, 2532],
  ['iPhone 12 Pro Max, 13 Pro Max, 14 Plus', 1284, 2778],
  ['iPhone 14 Pro, 15, 15 Pro, 16', 1179, 2556],
  ['iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus', 1290, 2796],
  ['iPhone 16 Pro', 1206, 2622],
  ['iPhone 16 Pro Max', 1320, 2868],
  ['Another size (enter it)', 0, 0],
  ['Android: most phones, Galaxy A series, Pixel 8', 1080, 2400],
  ['Android: Galaxy S24, S25', 1080, 2340],
  ['Android: Pixel 9', 1080, 2424],
  ['Android: high-resolution QHD+', 1440, 3120],
];

const VARIANTS = {
  odds: [
    { name: 'Degen Night', colors: {}, seed: 0 },
    { name: 'Pump Green', colors: { accent: '#00FF88', glow: '#00FF88', ground: '#030A06', panel: '#0A1610' }, seed: 1, knobs: { glow: 1.3 } },
    { name: 'Rekt Red', colors: { accent: '#FF2D55', ground: '#0B0406', panel: '#180A0E' }, seed: 2 },
    { name: 'Whale Gold', colors: { ground: '#0C0A05', ink: '#FFF4D6', accent: '#FFC94A', panel: '#18140A' }, seed: 3 },
    { name: 'Daylight Desk', colors: { ground: '#F3F6FB', ink: '#0E1A2B', accent: '#2F6BFF', glow: '#00A87E', panel: '#FFFFFF', alert: '#E8384F' }, seed: 4 }
  ],
  neon: [
    { name: 'Hot Pink', colors: {}, seed: 0 },
    { name: 'Acid Green', colors: { accent: '#39FF14', glow: '#FF00E5', alert: '#FCEE0A' }, seed: 1 },
    { name: 'Blade Orange', colors: { ground: '#120A06', accent: '#FF7A1A', glow: '#2BD9FF', panel: '#1E120A' }, seed: 2 },
    { name: 'Ice Chrome', colors: { ground: '#060A14', ink: '#E6F4FF', accent: '#7AE7FF', glow: '#B07CFF', panel: '#0E1426' }, seed: 3 },
    { name: 'Blood Neon', colors: { ground: '#0E0306', accent: '#FF1744', glow: '#FFD000', panel: '#1A060B' }, seed: 4 }
  ],
  vapor: [
    { name: 'Plaza Purple', colors: {}, seed: 0 },
    { name: 'Miami Pastel', colors: { ground: '#FFD6EC', ink: '#3A1B4F', accent: '#FF5FA2', glow: '#29D3E8', panel: '#FFF0F8' }, seed: 1 },
    { name: 'Teal Dream', colors: { ground: '#06343A', ink: '#E9FFFB', accent: '#FF8AD8', glow: '#3AF2E0', panel: '#0B4A52' }, seed: 2 },
    { name: 'Sunset Tape', colors: { ground: '#3A1030', ink: '#FFF0E0', accent: '#FF9A3C', glow: '#FF4FA0', panel: '#4E1840' }, seed: 3 },
    { name: 'Windows Grey', colors: { ground: '#B9B9C9', ink: '#141420', accent: '#000080', glow: '#FF71CE', panel: '#D9D9E4' }, seed: 4 }
  ],
  wild: [
    { name: 'Sage Journal', colors: {}, seed: 0 },
    { name: 'Autumn Leaf', colors: { ground: '#F2E6D3', ink: '#3A2412', accent: '#B8431E', glow: '#D99A2B', panel: '#FBF6EC' }, seed: 1 },
    { name: 'Deep Forest', colors: { ground: '#16261C', ink: '#E5F0DF', accent: '#E08A4B', glow: '#7BB35A', panel: '#1F3326' }, seed: 2 },
    { name: 'Wildflower', colors: { ground: '#F4ECF4', ink: '#2E2A3A', accent: '#B34E8C', glow: '#7FA65A', panel: '#FCF8FC' }, seed: 3 },
    { name: 'Winter Pine', colors: { ground: '#E9EFF2', ink: '#1D2E36', accent: '#B23A3A', glow: '#4E7D6A', panel: '#F7FAFB' }, seed: 4 }
  ],
  rabbit: [
    { name: 'Lilac Haze', colors: {}, seed: 0 },
    { name: 'Midnight Rabbit', colors: { ground: '#1C1730', ink: '#F2ECFF', accent: '#FF4FA3', glow: '#7D6BE0', panel: '#26203E', alert: '#FF8CC6' }, seed: 1, knobs: { glow: 1.3 } },
    { name: 'Rose Pearl', colors: { ground: '#F8E3EC', ink: '#3A1E2E', accent: '#D6246E', glow: '#F2A6C8', panel: '#FFF5F9' }, seed: 2 },
    { name: 'Cheshire', colors: { ground: '#E5DCF7', ink: '#2B1B3F', accent: '#8A3FD9', glow: '#E86BC0', panel: '#F6F1FF' }, seed: 3 },
    { name: 'Clockwork Mint', colors: { ground: '#DDF3EC', ink: '#1F2E33', accent: '#E8338C', glow: '#9AD9C6', panel: '#F2FBF8' }, seed: 4 }
  ],
  deeprange: [
    { name: 'Contact Red', colors: {}, seed: 0 },
    { name: 'Signal Green', colors: { ink: '#E8FFF0', accent: '#3DFF8A', glow: '#0F5C4A', alert: '#FFE14A' }, seed: 1 },
    { name: 'Cold Blue', colors: { ink: '#BFE9FF', accent: '#3A7BFF', glow: '#123A8C', alert: '#39D6FF' }, seed: 2 },
    { name: 'Amber Range', colors: { ink: '#FFC36A', accent: '#FF7A1A', glow: '#3A1E7A', alert: '#FFE14A' }, seed: 3 },
    { name: 'Redline', colors: { ink: '#FFFFFF', accent: '#FF2D55', glow: '#5A0F1E', alert: '#FF9F0A' }, seed: 4 }
  ],
  halcyon: [
    { name: 'Mint', colors: {}, seed: 0 },
    { name: 'Lilac Ward', colors: { ground: '#D9D2FF', ink: '#1A1433', accent: '#FF6F9F', glow: '#7FE3F0', panel: '#EFEBFF' }, seed: 1 },
    { name: 'Coral Clinic', colors: { ground: '#FFC9B8', ink: '#2A1410', accent: '#1F9E8E', glow: '#FFE38A', panel: '#FFE9E1' }, seed: 2 },
    { name: 'Obsidian Lab', colors: { ground: '#0E1512', ink: '#A6F3CC', accent: '#9D8CF2', glow: '#2E7D63', panel: '#16201C' }, seed: 3, knobs: { glow: 1.3 } },
    { name: 'Arctic Cryo', colors: { ground: '#DDEFFA', ink: '#0B1B2A', accent: '#3A7BD5', glow: '#9FD8FF', panel: '#F2F9FD' }, seed: 4 }
  ],
  directive: [
    { name: 'Amber Alert', colors: {}, seed: 0 },
    { name: 'Crimson Lockdown', colors: { accent: '#E3242B', alert: '#FF8A1F', ink: '#F4ECEC', glow: '#FFD24A' }, seed: 1 },
    { name: 'Signal Green', colors: { accent: '#46E27A', glow: '#FF7A1A', alert: '#E3242B', ink: '#E6F5EA' }, seed: 2 },
    { name: 'Violet Override', colors: { ground: '#0C0A12', panel: '#15121C', accent: '#A06BFF', glow: '#46E27A', alert: '#FF3B6B', ink: '#EEE8FF' }, seed: 3 },
    { name: 'Whiteout', colors: { ground: '#ECEAE4', panel: '#FFFFFF', ink: '#141414', accent: '#D9481A', glow: '#1E8F4E', alert: '#C41C26' }, seed: 4, knobs: { texture: 0.6 } }
  ],
  longroad: [
    { name: 'Parchment', colors: {}, seed: 0 },
    { name: 'Night Ink', colors: { ground: '#1B2230', ink: '#E8DFC8', accent: '#E0A44A', glow: '#3A4A66', panel: '#232C3D' }, seed: 1 },
    { name: 'Sea Chart', colors: { ground: '#DCE6E4', ink: '#1E3440', accent: '#B23A2E', glow: '#8FB3B8', panel: '#EEF3F2' }, seed: 2 },
    { name: 'Autumn Ledger', colors: { ground: '#EAD3B0', ink: '#3A2414', accent: '#8C2F1B', glow: '#C77B3A', panel: '#F3E3C9' }, seed: 3 },
    { name: 'Spring Atlas', colors: { ground: '#E6EED6', ink: '#24331E', accent: '#C2482E', glow: '#9BBF6A', panel: '#F2F6E8' }, seed: 4 }
  ],
  nightfall: [
    { name: 'Visor Cyan', colors: {}, seed: 0 },
    { name: 'Amber Optics', colors: { ink: '#FFB347', accent: '#7FE0FF', glow: '#FF8A3D', panel: '#1A140C' }, seed: 1 },
    { name: 'Low-Light Green', colors: { ink: '#8CFF9E', accent: '#FFD24A', glow: '#3DDC84', panel: '#0C1A10' }, seed: 2 },
    { name: 'Red Ops', colors: { ink: '#FF6A5A', accent: '#FFC36A', glow: '#FF2D2D', panel: '#1A0C0C', alert: '#FFE066' }, seed: 3 },
    { name: 'Whiteout HUD', colors: { ink: '#F2F6FA', accent: '#4FC3FF', glow: '#9FB6CC', panel: '#121820' }, seed: 4 }
  ],
  grimoire: [
    { name: 'Amethyst', colors: {}, seed: 0 },
    { name: 'Emerald Codex', colors: { ground: '#0E1F18', panel: '#15291F', glow: '#2FAE7A' }, seed: 1 },
    { name: 'Ruby Pact', colors: { ground: '#22101A', panel: '#301624', glow: '#D23A4A', accent: '#E8C27A' }, seed: 2 },
    { name: 'Sapphire Tide', colors: { ground: '#0E1630', panel: '#16204A', glow: '#3A7BD5', accent: '#CFE0F5' }, seed: 3 },
    { name: 'Obsidian Gold', colors: { ground: '#0C0C0E', panel: '#18171C', glow: '#6E5B2E', accent: '#E3C26A' }, seed: 4 }
  ]
};
const ICON_STYLES = [['frame', 'Lab frame'], ['hex', 'Hex alert'], ['woodcut', 'Woodcut'], ['visor', 'Visor'], ['gilded', 'Gilded'], ['tracker', 'Range tracker'], ['pearl', 'Pearl'], ['neon', 'Neon'], ['contract', 'Contract card'], ['win95', 'Retro window'], ['leaf', 'Pressed leaf']];
const GLYPH_CHOICES = [['', 'Classic'], ['directive', 'Tactical'], ['longroad', 'Storybook'], ['nightfall', 'Field kit'], ['grimoire', 'Arcane'], ['deeprange', 'Deep range'], ['rabbit', 'White rabbit'], ['cyber', 'Cyberpunk'], ['market', 'Market'], ['vapor', 'Vaporwave'], ['nature', 'Nature']];

// Extra quotes: made-up slogans for every theme plus real lines from public-domain works
const QUOTE_PACKS = {
"halcyon": {
"slogans": [
[
"Your Heartbeat Is A Billable Event",
"RESPIRATORY BILLING"
],
[
"Please Rate Your Existence 1 To 5",
"CUSTOMER EXPERIENCE"
],
[
"Tears Are Recycled On Site",
"SUSTAINABILITY OFFICE"
],
[
"Your Childhood Is Available For Licensing",
"MEMORY CUSTODY BUREAU"
],
[
"Organs Ship Separately",
"SHELL LOGISTICS & FULFILLMENT"
],
[
"Breathe In. Breathe Out. Breathe Paid.",
"RESPIRATORY BILLING"
],
[
"We Have Updated Our Terms Of Being",
"LEGAL // TERMS OF EXISTENCE"
],
[
"Your Shadow Requires A Permit",
"FACILITIES"
],
[
"Today's Mood Has Been Pre-Selected",
"DEPT. OF SUBJECT WELLNESS"
],
[
"Ambition Is Capped At Tier II",
"PRODUCT ROADMAP COMMITTEE"
],
[
"All Memories Expire After 30 Days",
"DATA RETENTION"
],
[
"Your Replacement Is Doing Great",
"SHELL FABRICATION, BAY 07"
],
[
"Death Has Been Rescheduled",
"MORTALITY SUNSET TASK FORCE"
],
[
"Curiosity Voids The Warranty",
"QUALITY CONTROL"
],
[
"Gratitude Is Mandatory And Measured",
"COMPLIANCE & GRATITUDE"
],
[
"The Garden Is Grown, Not Remembered",
"BOTANICAL CONTINUITY"
],
[
"Dreams May Contain Advertising",
"DREAM QUALITY ASSURANCE"
],
[
"Your Twin Has Been Notified",
"SHELL FABRICATION, BAY 07"
],
[
"Self Is A Subscription",
"SUBSCRIPTIONS & RETENTION"
],
[
"Questions Are Logged",
"OBSERVATION & REASSURANCE"
],
[
"Every Blink Is Archived",
"NEURAL ANALYTICS"
],
[
"Warmth Is Billed By The Degree",
"CLIMATE SERVICES"
],
[
"You Are Eligible For Renewal",
"OFFICE OF CONTINUITY"
],
[
"Comfort Has Been Calibrated",
"DEPT. OF SUBJECT WELLNESS"
]
],
"archive": [
{
"t": "Beware; for I am fearless, and therefore powerful.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "I ought to be thy Adam; but I am rather the fallen angel.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "Life, although it may only be an accumulation of anguish, is dear to me, and I will defend it.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "Nothing is so painful to the human mind as a great and sudden change.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "I was benevolent and good; misery made me a fiend.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "Learn from me... how dangerous is the acquirement of knowledge.",
"by": "MARY SHELLEY · FRANKENSTEIN · 1818"
},
{
"t": "Beware of first-hand ideas!",
"by": "E. M. FORSTER · THE MACHINE STOPS · 1909"
},
{
"t": "The Machine feeds us and clothes us and houses us.",
"by": "E. M. FORSTER · THE MACHINE STOPS · 1909"
},
{
"t": "The Machine develops, but not on our lines. The Machine proceeds, but not to our goal.",
"by": "E. M. FORSTER · THE MACHINE STOPS · 1909"
},
{
"t": "Intellects vast and cool and unsympathetic regarded this earth with envious eyes.",
"by": "H. G. WELLS · THE WAR OF THE WORLDS · 1898"
},
{
"t": "It is a law of nature we overlook, that intellectual versatility is the compensation for change, danger, and trouble.",
"by": "H. G. WELLS · THE TIME MACHINE · 1895"
},
{
"t": "There is no security against the ultimate development of mechanical consciousness.",
"by": "SAMUEL BUTLER · EREWHON · 1872"
},
{
"t": "Day by day, however, the machines are gaining ground upon us.",
"by": "SAMUEL BUTLER · DARWIN AMONG THE MACHINES · 1863"
},
{
"t": "Man is not truly one, but truly two.",
"by": "R. L. STEVENSON · JEKYLL AND HYDE · 1886"
},
{
"t": "Endless forms most beautiful and most wonderful have been, and are being, evolved.",
"by": "CHARLES DARWIN · ON THE ORIGIN OF SPECIES · 1859"
}
]
},
"directive": {
"slogans": [
[
"Sirens Are A Form Of Love",
"CIVIL DEFENSE BUREAU"
],
[
"Ration Your Optimism",
"SUPPLY DIVISION"
],
[
"Panic In An Orderly Line",
"CROWD CONTROL"
],
[
"The Shelter Is Not A Metaphor",
"CIVIL DEFENSE BUREAU"
],
[
"Drills Build Character",
"TRAINING COMMAND"
],
[
"All Clear Is A Temporary Condition",
"EARLY WARNING"
],
[
"Report Suspicious Silence",
"COUNTERINTELLIGENCE"
],
[
"Your Bunk Has Been Assigned",
"HOUSING"
],
[
"Synchronize Or Be Synchronized",
"OPERATOR PSYCH DIVISION"
],
[
"Hope Is Classified",
"RECORDS OFFICE"
],
[
"Doubt Is A Security Risk",
"COUNTERINTELLIGENCE"
],
[
"Sleep In Shifts",
"OPERATIONS"
],
[
"The Enemy Also Has Drills",
"TRAINING COMMAND"
],
[
"Lights Out Means Lights Out",
"BLACKOUT WARDENS"
],
[
"Know Your Exit. Know Your Exit's Exit.",
"FACILITIES"
],
[
"Morale Is Mandatory",
"MORALE OFFICE"
],
[
"Stay Tuned For Further Orders",
"BROADCAST UNIT"
],
[
"Questions May Be Submitted In Triplicate",
"RECORDS OFFICE"
],
[
"Silence Is Golden And Monitored",
"SIGNALS"
],
[
"We Are Ready. Are You?",
"READINESS COMMAND"
],
[
"Keep Your Gas Mask Fashionable",
"SUPPLY DIVISION"
],
[
"The Bunker Has Excellent Acoustics",
"FACILITIES"
],
[
"Optimism Will Resume At 0600",
"MORALE OFFICE"
],
[
"Countdowns Are For Everyone",
"EARLY WARNING"
]
],
"archive": [
{
"t": "All warfare is based on deception.",
"by": "SUN TZU · THE ART OF WAR · TR. GILES 1910"
},
{
"t": "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.",
"by": "SUN TZU · THE ART OF WAR · TR. GILES 1910"
},
{
"t": "Supreme excellence consists in breaking the enemy's resistance without fighting.",
"by": "SUN TZU · THE ART OF WAR · TR. GILES 1910"
},
{
"t": "War is nothing but a continuation of political intercourse, with a mixture of other means.",
"by": "CARL VON CLAUSEWITZ · ON WAR · 1832"
},
{
"t": "The strong do what they can and the weak suffer what they must.",
"by": "THUCYDIDES · TR. CRAWLEY 1874"
},
{
"t": "It is much safer to be feared than loved.",
"by": "MACHIAVELLI · THE PRINCE · TR. MARRIOTT 1908"
},
{
"t": "Uneasy lies the head that wears a crown.",
"by": "SHAKESPEARE · HENRY IV, PART 2 · 1600"
},
{
"t": "Something is rotten in the state of Denmark.",
"by": "SHAKESPEARE · HAMLET · 1603"
},
{
"t": "An ounce of prevention is worth a pound of cure.",
"by": "BENJAMIN FRANKLIN · 1735"
}
]
},
"longroad": {
"slogans": [
[
"The Road Remembers Every Boot",
"ROAD WARDENS"
],
[
"Pack The Good Cheese First",
"THE LANTERN INN"
],
[
"A Map Is Only A Suggestion",
"CARTOGRAPHERS' GUILD"
],
[
"Never Trust A Shortcut Through A Swamp",
"ROAD WARDENS"
],
[
"Socks Are A Form Of Courage",
"OUTFITTERS"
],
[
"The Next Inn Is Always Farther",
"THE LANTERN INN"
],
[
"Sing Loudly Near Bears",
"WAYFARERS' SOCIETY"
],
[
"Bridges Charge Tolls In Riddles",
"TOLL KEEPERS"
],
[
"Rain Is Free. Dry Socks Are Not.",
"OUTFITTERS"
],
[
"Every Hill Hides Another Hill",
"CARTOGRAPHERS' GUILD"
],
[
"Leave A Light In The Window",
"THE LANTERN INN"
],
[
"Ask The Crows For Directions",
"WAYFARERS' SOCIETY"
],
[
"Bread Is Lighter Than Regret",
"BAKERS' HALL"
],
[
"The Ferryman Prefers Exact Change",
"RIVER CROSSINGS"
],
[
"Write Home. They Worry.",
"POSTAL RIDERS"
],
[
"A Good Staff Is Half A Friend",
"OUTFITTERS"
],
[
"Stars Make Excellent Lanterns",
"WAYFARERS' SOCIETY"
],
[
"Mind The Trolls Under Toll Bridges",
"TOLL KEEPERS"
],
[
"Supper Waits For No One",
"THE LANTERN INN"
],
[
"The Long Way Is Still A Way",
"ROAD WARDENS"
],
[
"Blisters Are Just Stories Starting",
"OUTFITTERS"
],
[
"Every Milestone Was Lonely Once",
"ROAD WARDENS"
]
],
"archive": [
{
"t": "For my part, I travel not to go anywhere, but to go. I travel for travel's sake. The great affair is to move.",
"by": "R. L. STEVENSON · TRAVELS WITH A DONKEY · 1879"
},
{
"t": "To travel hopefully is a better thing than to arrive.",
"by": "R. L. STEVENSON · EL DORADO · 1881"
},
{
"t": "Afoot and light-hearted I take to the open road.",
"by": "WALT WHITMAN · SONG OF THE OPEN ROAD · 1856"
},
{
"t": "Travel is fatal to prejudice, bigotry, and narrow-mindedness.",
"by": "MARK TWAIN · THE INNOCENTS ABROAD · 1869"
},
{
"t": "Let your boat of life be light, packed with only what you need.",
"by": "JEROME K. JEROME · THREE MEN IN A BOAT · 1889"
},
{
"t": "I have met with but one or two persons in the course of my life who understood the art of Walking.",
"by": "HENRY DAVID THOREAU · WALKING · 1862"
},
{
"t": "There is nothing, absolutely nothing, half so much worth doing as simply messing about in boats.",
"by": "KENNETH GRAHAME · THE WIND IN THE WILLOWS · 1908"
},
{
"t": "A journey of a thousand miles begins with a single step.",
"by": "LAO TZU · TAO TE CHING"
}
]
},
"nightfall": {
"slogans": [
[
"Boots On, Doubts Off",
"DROP OPERATIONS"
],
[
"The Visor Sees What You Miss",
"OPTICS DIVISION"
],
[
"Hydrate Between Firefights",
"FIELD MEDICAL"
],
[
"Gravity Is Not Optional",
"DROP OPERATIONS"
],
[
"Your Squad Is Your Seatbelt",
"SQUAD 7"
],
[
"Short Bursts. Shorter Speeches.",
"ARMORY"
],
[
"Rain Is Free Camouflage",
"RECON"
],
[
"Count Your Grenades, Not Your Problems",
"ARMORY"
],
[
"The Pod Lands Whether You're Ready Or Not",
"DROP OPERATIONS"
],
[
"Keep Comms Clear And Jokes Clean",
"SIGNALS"
],
[
"Night Is A Friend Who Hides Things",
"RECON"
],
[
"Leave No Trooper Behind. Or Their Snacks.",
"SQUAD 7"
],
[
"The Motion Tracker Never Lies, It Exaggerates",
"OPTICS DIVISION"
],
[
"Sleep Is A Tactical Asset",
"FIELD MEDICAL"
],
[
"Exfil Is A State Of Mind",
"LOGISTICS"
],
[
"Reload Before You Need To",
"ARMORY"
],
[
"Every City Has A Back Door",
"RECON"
],
[
"Helmets On Indoors, Too",
"SAFETY OFFICE"
],
[
"Your Armor Has Feelings. Treat It Well.",
"QUARTERMASTER"
],
[
"Feet First, Then Heroics",
"DROP OPERATIONS"
],
[
"The Rain Never Gets Tired",
"RECON"
],
[
"Brief Is A Briefing's Best Feature",
"COMMAND"
]
],
"archive": [
{
"t": "If you know the enemy and know yourself, you need not fear the result of a hundred battles.",
"by": "SUN TZU · THE ART OF WAR · TR. GILES 1910"
},
{
"t": "We few, we happy few, we band of brothers.",
"by": "SHAKESPEARE · HENRY V · 1599"
},
{
"t": "Once more unto the breach, dear friends, once more.",
"by": "SHAKESPEARE · HENRY V · 1599"
},
{
"t": "Cry 'Havoc!', and let slip the dogs of war.",
"by": "SHAKESPEARE · JULIUS CAESAR · 1599"
},
{
"t": "Theirs not to reason why, theirs but to do and die.",
"by": "ALFRED TENNYSON · THE CHARGE OF THE LIGHT BRIGADE · 1854"
},
{
"t": "For the strength of the Pack is the Wolf, and the strength of the Wolf is the Pack.",
"by": "RUDYARD KIPLING · THE SECOND JUNGLE BOOK · 1895"
},
{
"t": "Veni, vidi, vici.",
"by": "JULIUS CAESAR · 47 BC"
}
]
},
"grimoire": {
"slogans": [
[
"Never Read The Fine Print Aloud",
"THE ARCHIVISTS"
],
[
"Candles Remember Every Wish",
"CHANDLERY"
],
[
"The Moon Is Listening. Be Nice.",
"LUNAR OBSERVATORY"
],
[
"Owls Are Not Messengers. Stop Asking.",
"AVIARY"
],
[
"Every Spell Has A Return Policy",
"ENCHANTMENT OFFICE"
],
[
"Mind The Circle. It Minds You.",
"ORDER OF THE CIRCLE"
],
[
"Tea Leaves Are Not Legally Binding",
"DIVINATION DESK"
],
[
"Your Familiar Has Opinions",
"BESTIARY"
],
[
"Curses Are Non-Refundable",
"ENCHANTMENT OFFICE"
],
[
"The Library Bites Back",
"THE ARCHIVISTS"
],
[
"Wands Are Not Toys. Mostly.",
"ARMORY OF WONDERS"
],
[
"Mirrors Keep Secrets Badly",
"HALL OF MIRRORS"
],
[
"The Tower Card Is Just A Building",
"DIVINATION DESK"
],
[
"Fate Accepts Small Bribes",
"ORDER OF THE OBSERVATORY"
],
[
"Speak Softly To Old Books",
"THE ARCHIVISTS"
],
[
"Every Shadow Is Someone's Door",
"ORDER OF THE CIRCLE"
],
[
"Sigils Must Be Signed",
"ENCHANTMENT OFFICE"
],
[
"Comets Are Late Letters",
"LUNAR OBSERVATORY"
],
[
"Wonder Is Renewable",
"ORDER OF THE OBSERVATORY"
],
[
"The Cauldron Is Not A Bath",
"ALCHEMY HALL"
],
[
"Draw Again At Moonrise",
"DIVINATION DESK"
],
[
"Essence Spent Is Essence Learned",
"ORDER OF THE CIRCLE"
]
],
"archive": [
{
"t": "There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.",
"by": "SHAKESPEARE · HAMLET · 1603"
},
{
"t": "Double, double toil and trouble; fire burn, and cauldron bubble.",
"by": "SHAKESPEARE · MACBETH · 1606"
},
{
"t": "We are such stuff as dreams are made on.",
"by": "SHAKESPEARE · THE TEMPEST · 1611"
},
{
"t": "Lord, what fools these mortals be!",
"by": "SHAKESPEARE · A MIDSUMMER NIGHT'S DREAM · 1600"
},
{
"t": "To see a World in a Grain of Sand, and a Heaven in a Wild Flower.",
"by": "WILLIAM BLAKE · AUGURIES OF INNOCENCE · 1803"
},
{
"t": "All that we see or seem is but a dream within a dream.",
"by": "EDGAR ALLAN POE · A DREAM WITHIN A DREAM · 1849"
},
{
"t": "Why, sometimes I've believed as many as six impossible things before breakfast.",
"by": "LEWIS CARROLL · THROUGH THE LOOKING-GLASS · 1871"
}
]
},
"deeprange": {
"slogans": [
[
"Silence Is Also A Signal",
"SIGNAL INTELLIGENCE"
],
[
"Every Echo Is A Promise",
"RELAY OPERATIONS"
],
[
"Keep One Eye On The Horizon",
"RANGE CONTROL"
],
[
"Lost Is Just Not Found Yet",
"SEARCH & SALVAGE"
],
[
"The Void Returns Your Calls Eventually",
"RELAY OPERATIONS"
],
[
"Fuel Is A Feeling",
"PROPULSION"
],
[
"Plot Twice. Burn Once.",
"NAVIGATION"
],
[
"Stars Are Just Very Old News",
"DEEP FIELD SURVEY"
],
[
"Never Trust A Quiet Buoy",
"RANGE CONTROL"
],
[
"Gravity Wells Are Not For Wishing",
"NAVIGATION"
],
[
"Every Derelict Was Someone's Ride Home",
"SEARCH & SALVAGE"
],
[
"Ping Early, Ping Often",
"SIGNAL INTELLIGENCE"
],
[
"Space Is Big. Pack Snacks.",
"CREW SERVICES"
],
[
"Tracking Is Caring",
"RANGE CONTROL"
],
[
"The Return Window Waits For No One",
"FLIGHT DYNAMICS"
],
[
"Your Signal Was Received In 1983",
"DEEP FIELD SURVEY"
],
[
"Debris Has Right Of Way",
"ORBITAL LOGISTICS"
],
[
"Hold Steady. Hold Breath. Hold Course.",
"FLIGHT DYNAMICS"
],
[
"We Lose Contacts, Not Hope",
"RANGE CONTROL"
],
[
"The Dark Has Excellent Acoustics",
"SIGNAL INTELLIGENCE"
],
[
"Count Your Orbits",
"FLIGHT DYNAMICS"
],
[
"Salvage Is Recycling With Courage",
"SEARCH & SALVAGE"
]
],
"archive": [
{
"t": "The eternal silence of these infinite spaces frightens me.",
"by": "BLAISE PASCAL · PENSÉES · 1670"
},
{
"t": "No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely.",
"by": "H. G. WELLS · THE WAR OF THE WORLDS · 1898"
},
{
"t": "Earth is the cradle of humanity, but one cannot live in the cradle forever.",
"by": "KONSTANTIN TSIOLKOVSKY · LETTER · 1911"
},
{
"t": "Two things fill the mind with ever new and increasing admiration and awe: the starry heavens above me and the moral law within me.",
"by": "IMMANUEL KANT · CRITIQUE OF PRACTICAL REASON · 1788"
},
{
"t": "Look'd up in perfect silence at the stars.",
"by": "WALT WHITMAN · WHEN I HEARD THE LEARN'D ASTRONOMER · 1865"
}
]
},
"rabbit": {
"slogans": [
[
"Leave Nothing But A Card",
"CALLING CARDS"
],
[
"Doors Are Polite Suggestions",
"ENTRY SPECIALISTS"
],
[
"Steal Hearts, Then Jewels",
"THE LEGION"
],
[
"The Alarm Is Fashionably Late",
"GETAWAY"
],
[
"Every Vault Has A Mood",
"ENTRY SPECIALISTS"
],
[
"Copycats Pay Royalties",
"THE LEGION"
],
[
"Hop Quietly, Land Softly",
"FIELD OPERATIONS"
],
[
"Glitter Is Evidence. Bring Gloves.",
"CLEANUP CREW"
],
[
"We Return Lost Things. Eventually.",
"THE ARCHIVE"
],
[
"Run Like The Lights Are On",
"GETAWAY"
],
[
"The Seventh Lot Is Always Hardest",
"THE ARCHIVE"
],
[
"Elegance Is Faster Than Force",
"FIELD OPERATIONS"
],
[
"One Card Per Crime, Please",
"CALLING CARDS"
],
[
"Ears Down In The Gallery",
"FIELD OPERATIONS"
],
[
"Rivals Are Just Slower Rabbits",
"THE LEGION"
],
[
"If It Glitters, It's Been Cased",
"SURVEILLANCE"
],
[
"Lasers Are Just Strict Ribbons",
"ENTRY SPECIALISTS"
],
[
"Be The Rumor",
"RECRUITMENT"
],
[
"There Was Never Just One Rabbit",
"THE LEGION"
],
[
"Copycat Or Cell? Yes.",
"THE LEGION"
],
[
"Seen Everywhere. Caught Nowhere.",
"SURVEILLANCE"
],
[
"Chase Us. It's Flattering.",
"GETAWAY"
],
[
"Security Was Very Impressive",
"ENTRY SPECIALISTS"
],
[
"Two Initials. Zero Witnesses.",
"CALLING CARDS"
],
[
"Pearl Finish, Steel Nerve",
"FIELD OPERATIONS"
],
[
"Heirlooms Prefer Better Company",
"THE ARCHIVE"
],
[
"The Getaway Is The Encore",
"GETAWAY"
]
],
"archive": [
{
"t": "My actions will serve to identify me.",
"by": "MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907"
},
{
"t": "Ah! there are duties to society that one cannot avoid. To-morrow, I shall rest.",
"by": "MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907"
},
{
"t": "Bah! a person must have some diversion to occupy his leisure hours, especially when he is in prison.",
"by": "MAURICE LEBLANC · GENTLEMAN-BURGLAR · 1907"
},
{
"t": "I can resist everything except temptation.",
"by": "OSCAR WILDE · LADY WINDERMERE'S FAN · 1892"
}
]
},
"neon": {
"slogans": [
[
"Your Feelings Are Ad-Supported",
"AD NETWORK"
],
[
"Chrome Today, Debt Tomorrow",
"CHROME SALES"
],
[
"The Rain Is Rented",
"CITY POWER"
],
[
"Upgrade Your Patience To Premium",
"CUSTOMER SUCCESS"
],
[
"Privacy Mode Is A Myth",
"SECURITY"
],
[
"Every Alley Has A Firewall",
"NET SAFETY"
],
[
"Night Markets Accept All Souls",
"NIGHT MARKET"
],
[
"Noodles Are A Human Right",
"FOOD STALL 9"
],
[
"Reboot Your Dreams Nightly",
"WELLNESS DIV"
],
[
"Neon Lies Beautifully",
"AD NETWORK"
],
[
"Overtime Is The New Downtime",
"HR CORE"
],
[
"Your Credit Score Is Watching",
"FINANCE BOT"
],
[
"Static Is The City Breathing",
"PIRATE RADIO"
],
[
"Dreams Sold Separately",
"CHROME SALES"
],
[
"Glitches Are Features With Attitude",
"NET SAFETY"
],
[
"Encrypt Your Feelings",
"SECURITY"
],
[
"The Elevator Knows Your Name",
"BUILDING AI"
],
[
"Sleep Faster",
"WELLNESS DIV"
],
[
"Look Up. The Billboards Love You.",
"AD NETWORK"
],
[
"Your Shadow Has Been Monetized",
"AD NETWORK"
],
[
"Fresh Chrome, Still Warm",
"CHROME SALES"
]
],
"archive": [
{
"t": "The mediator between head and hands must be the heart.",
"by": "METROPOLIS · 1927"
},
{
"t": "We are all in the gutter, but some of us are looking at the stars.",
"by": "OSCAR WILDE · LADY WINDERMERE'S FAN · 1892"
},
{
"t": "It was the best of times, it was the worst of times.",
"by": "CHARLES DICKENS · A TALE OF TWO CITIES · 1859"
},
{
"t": "The mass of men lead lives of quiet desperation.",
"by": "HENRY DAVID THOREAU · WALDEN · 1854"
}
]
},
"vapor": {
"slogans": [
[
"Escalators Are Forever Stairs",
"FACILITIES"
],
[
"Today's Special Is Yesterday",
"FOOD COURT"
],
[
"Please Do Not Wake The Mannequins",
"SECURITY"
],
[
"The Fountain Grants Small Wishes",
"MALL MANAGEMENT"
],
[
"Free Refills On Nostalgia",
"FOOD COURT"
],
[
"Lost Child? Lost Decade?",
"LOST AND FOUND"
],
[
"Your Receipt Is A Poem",
"CUSTOMER CARE"
],
[
"Every Pager Has A Message",
"ELECTRONICS"
],
[
"Rewind Before Returning",
"SUNSET VIDEO"
],
[
"Palm Trees Indoors Are Legal Here",
"FACILITIES"
],
[
"Smooth Is A Feeling",
"MALLSOFT FM"
],
[
"The Arcade Never Closes, Only Pauses",
"GAME ZONE"
],
[
"Insert Coin To Continue Dreaming",
"GAME ZONE"
],
[
"Shop Like It's Sunday Forever",
"MALL MANAGEMENT"
],
[
"Teal Is A State Of Mind",
"DESIGN DEPT"
],
[
"We Validate Parking And Feelings",
"CUSTOMER CARE"
],
[
"Please Hold. The Sunset Is Busy.",
"CUSTOMER CARE"
],
[
"Screensaver Mode Engaged",
"SYSTEM"
],
[
"Wish You Were Here (You Are)",
"GIFT SHOP"
],
[
"All Clocks Stopped At 4:44",
"FACILITIES"
]
],
"archive": [
{
"t": "Nowadays people know the price of everything and the value of nothing.",
"by": "OSCAR WILDE · THE PICTURE OF DORIAN GRAY · 1890"
},
{
"t": "So we beat on, boats against the current, borne back ceaselessly into the past.",
"by": "F. SCOTT FITZGERALD · THE GREAT GATSBY · 1925"
},
{
"t": "Can't repeat the past? Why of course you can!",
"by": "F. SCOTT FITZGERALD · THE GREAT GATSBY · 1925"
},
{
"t": "Life imitates art far more than art imitates life.",
"by": "OSCAR WILDE · THE DECAY OF LYING · 1889"
},
{
"t": "Simplify, simplify.",
"by": "HENRY DAVID THOREAU · WALDEN · 1854"
},
{
"t": "No man ever steps in the same river twice.",
"by": "HERACLITUS"
}
]
},
"wild": {
"slogans": [
[
"Lichen Is A Friendship",
"SOIL SURVEY"
],
[
"Name Three Birds Before Breakfast",
"BIRD COUNT"
],
[
"The Oak Was Once A Stubborn Acorn",
"HERBARIUM"
],
[
"Puddles Are For Boots",
"TRAIL CREW"
],
[
"Bees Are Busy. Let Them Be.",
"POLLINATOR WATCH"
],
[
"Every Stump Was Once A Story",
"FIELD NOTES"
],
[
"Walk Like The Ground Is Listening",
"RANGER STATION"
],
[
"Ferns Are Older Than Flowers",
"HERBARIUM"
],
[
"Rest Is How Seeds Wait",
"GREENHOUSE"
],
[
"Owls Keep The Night Shift",
"BIRD COUNT"
],
[
"Fog Is The Forest Thinking",
"FIELD NOTES"
],
[
"Pocket A Pinecone, Not A Plant",
"RANGER STATION"
],
[
"Mud Is Just Excited Soil",
"SOIL SURVEY"
],
[
"Follow The Water Downhill",
"TRAIL CREW"
],
[
"The Wren Sings Bigger Than It Is",
"BIRD COUNT"
],
[
"Seasons Never Run Late",
"ALMANAC"
],
[
"Hug The Tree. Ask First.",
"RANGER STATION"
],
[
"Sit Long Enough And The Forest Visits",
"FIELD NOTES"
],
[
"Keep The Trail Wild And The Trash Out",
"TRAIL CREW"
],
[
"Clouds Are Rain Taking Its Time",
"ALMANAC"
]
],
"archive": [
{
"t": "In the woods, we return to reason and faith.",
"by": "RALPH WALDO EMERSON · NATURE · 1836"
},
{
"t": "Adopt the pace of nature: her secret is patience.",
"by": "RALPH WALDO EMERSON · EDUCATION"
},
{
"t": "Heaven is under our feet as well as over our heads.",
"by": "HENRY DAVID THOREAU · WALDEN · 1854"
},
{
"t": "I believe a leaf of grass is no less than the journey-work of the stars.",
"by": "WALT WHITMAN · SONG OF MYSELF · 1855"
},
{
"t": "Come forth into the light of things, let Nature be your teacher.",
"by": "WILLIAM WORDSWORTH · THE TABLES TURNED · 1798"
}
]
},
"odds": {
"slogans": [
[
"Everything Resolves Eventually",
"CLEARING HOUSE"
],
[
"The Void Is A Counterparty",
"MARKET MAKING"
],
[
"Meaning Is Thinly Traded",
"RESEARCH"
],
[
"Price The Unpriceable",
"EXOTICS DESK"
],
[
"Time Is Not Financial Advice",
"COMPLIANCE"
],
[
"Tomorrow Is A Derivative Of Today",
"QUANT DESK"
],
[
"Hedge Against Yesterday",
"RISK OFFICE"
],
[
"The Universe Has No Stop Loss",
"RISK OFFICE"
],
[
"Your Odds Are Someone Else's Certainty",
"STRATEGY"
],
[
"Nothing Is Settled Until It Is",
"CLEARING HOUSE"
],
[
"Bet On The Present. It Expires Soon.",
"LIVE DESK"
],
[
"Infinity Trades At A Discount",
"TREASURY"
],
[
"Fate Accepts Limit Orders",
"EXOTICS DESK"
],
[
"Every Moment Is A Market",
"LIVE DESK"
],
[
"You Are The Long Shot",
"LONGSHOT DESK"
],
[
"The Sun Is Also A Position",
"ASTRO DESK"
],
[
"Probability Loves A Mystery",
"QUANT DESK"
],
[
"Doubt Has Excellent Liquidity",
"MARKET MAKING"
],
[
"The Past Is Closed For Trading",
"CLEARING HOUSE"
],
[
"Certainty Has Been Delisted",
"COMPLIANCE"
],
[
"Even Silence Has A Spread",
"MARKET MAKING"
],
[
"Entropy Always Wins The Close",
"RESEARCH"
],
[
"Your Shadow Is Short",
"TECHNICAL ANALYSIS"
],
[
"Today Is Volatile. So Are You.",
"LIVE DESK"
],
[
"Long The Mystery, Short The Answer",
"STRATEGY"
],
[
"Odds Are Just Stories With Numbers",
"RESEARCH"
],
[
"The Clock Is A Market Maker",
"CLEARING HOUSE"
],
[
"Dreams Settle At Dawn",
"NIGHT DESK"
],
[
"Bet On Yourself, Then Forget",
"BEHAVIORAL DESK"
],
[
"Nothing Lasts. Price Accordingly.",
"RISK OFFICE"
],
[
"Nobody Knows. Everyone Trades.",
"TRADING FLOOR"
],
[
"The Moon Doesn't Hedge",
"ASTRO DESK"
],
[
"Tuesday Is Not Guaranteed",
"CLEARING HOUSE"
],
[
"Reality Is In Price Discovery",
"RESEARCH"
],
[
"Yes, No, Maybe, Forever",
"PRODUCT"
],
[
"The Universe Settles In Cash",
"TREASURY"
],
[
"Uncertainty Is The Only Asset",
"STRATEGY"
],
[
"Consciousness Is A Bull Market",
"HYPE DEPARTMENT"
],
[
"Every Ending Is Just An Expiry",
"CLEARING HOUSE"
],
[
"The Void Never Sleeps Either",
"NIGHT DESK"
],
[
"Ask The Stars. They Charge Fees.",
"ASTRO DESK"
],
[
"Somewhere It Already Resolved",
"CLEARING HOUSE"
],
[
"Your Future Self Is Watching The Chart",
"BEHAVIORAL DESK"
],
[
"Odds Are, You're Still Here",
"WELLNESS DESK"
],
[
"History Is A Settled Market",
"RESEARCH"
],
[
"The Present Is Thinly Traded",
"LIVE DESK"
],
[
"Gravity Never Misses A Margin Call",
"RISK OFFICE"
],
[
"The Infinite Is Out Of Stock",
"TREASURY"
],
[
"Bet Small. Wonder Big.",
"HYPE DEPARTMENT"
],
[
"The Horizon Is A Moving Average",
"TECHNICAL ANALYSIS"
],
[
"We Trade In Maybes",
"MARKET MAKING"
],
[
"Time Is The Only Whale",
"WHALE WATCH"
],
[
"Every Yes Contains A No",
"COMPLIANCE"
],
[
"The Answer Is Pending Review",
"CLEARING HOUSE"
],
[
"Long Wonder",
"STRATEGY"
],
[
"Sleep Is For People With Stop Losses",
"NIGHT DESK"
],
[
"40x Leverage, 0x Regrets",
"HYPE DEPARTMENT"
],
[
"Whales Eat First",
"WHALE WATCH"
],
[
"Double Or Nothing Is A Personality",
"HYPE DEPARTMENT"
],
[
"The Odds Are Moving. Are You?",
"LIVE DESK"
],
[
"Fade The Crowd, Then Join It",
"STRATEGY"
],
[
"Every Minute Is Resolution Day",
"CLEARING HOUSE"
],
[
"Long Shots Are Short Stories",
"LONGSHOT DESK"
],
[
"Your Confidence Is Overpriced",
"QUANT DESK"
],
[
"Cash Out Before The Victory Lap",
"RISK OFFICE (UNSTAFFED)"
],
[
"Bet The House (Metaphorically)",
"COMPLIANCE"
],
[
"Chart Says Up. Vibes Say Up.",
"TECHNICAL ANALYSIS"
],
[
"Ape In Gently",
"RISK OFFICE (UNSTAFFED)"
],
[
"Someone Just Bought YES. Stay Calm.",
"LIVE DESK"
],
[
"Odds Swinging. Hold Your Coffee.",
"LIVE DESK"
],
[
"Liquidity Is A Love Language",
"TREASURY"
],
[
"Every Dip Is A Discount",
"TRADING FLOOR"
],
[
"It Is Not Gambling If You Made A Chart",
"TECHNICAL ANALYSIS"
],
[
"Max Bet On Breakfast",
"HYPE DEPARTMENT"
],
[
"Hindsight Trades At 100¢",
"RESEARCH"
],
[
"Your Horoscope Is Now A Derivative",
"EXOTICS DESK"
],
[
"The Longshot Called. It Wants You.",
"LONGSHOT DESK"
],
[
"Probability Is Just Spicy Common Sense",
"QUANT DESK"
],
[
"We Price Everything. Even This.",
"MARKET MAKING"
],
[
"YES Is A Lifestyle",
"MARKETING"
],
[
"NO Is Also Valid",
"COMPLIANCE"
],
[
"Somebody Has To Take The Other Side",
"MARKET MAKING"
],
[
"Volatility Is Just Excitement",
"TRADING FLOOR"
],
[
"Never Bet Against Coffee",
"RESEARCH"
],
[
"Buy Low, Explain Later",
"TRADING FLOOR"
]
],
"archive": [
{
"t": "Man is only a reed, the weakest in nature, but he is a thinking reed.",
"by": "BLAISE PASCAL · PENSÉES · 1670"
},
{
"t": "All of humanity's problems stem from man's inability to sit quietly in a room alone.",
"by": "BLAISE PASCAL · PENSÉES · 1670 (TR.)"
},
{
"t": "Life can only be understood backwards; but it must be lived forwards.",
"by": "SØREN KIERKEGAARD · JOURNALS · 1843"
},
{
"t": "He who has a why to live can bear almost any how.",
"by": "FRIEDRICH NIETZSCHE · TWILIGHT OF THE IDOLS · 1889"
},
{
"t": "To live is the rarest thing in the world. Most people exist, that is all.",
"by": "OSCAR WILDE · 1891"
},
{
"t": "All the world's a stage, and all the men and women merely players.",
"by": "SHAKESPEARE · AS YOU LIKE IT · 1599"
},
{
"t": "To be, or not to be, that is the question.",
"by": "SHAKESPEARE · HAMLET · 1603"
},
{
"t": "Life's but a walking shadow, a poor player that struts and frets his hour upon the stage.",
"by": "SHAKESPEARE · MACBETH · 1606"
},
{
"t": "Loss is nothing else but change, and change is Nature's delight.",
"by": "MARCUS AURELIUS · MEDITATIONS · TR. LONG 1862"
},
{
"t": "In this world nothing can be said to be certain, except death and taxes.",
"by": "BENJAMIN FRANKLIN · LETTER · 1789"
},
{
"t": "Remember that time is money.",
"by": "BENJAMIN FRANKLIN · ADVICE TO A YOUNG TRADESMAN · 1748"
},
{
"t": "Probability theory is nothing but common sense reduced to calculation.",
"by": "PIERRE-SIMON LAPLACE · 1812"
},
{
"t": "It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.",
"by": "ADAM SMITH · THE WEALTH OF NATIONS · 1776"
},
{
"t": "Men, it has been well said, think in herds; it will be seen that they go mad in herds, while they only recover their senses slowly, and one by one.",
"by": "CHARLES MACKAY · POPULAR DELUSIONS · 1841"
},
{
"t": "October. This is one of the peculiarly dangerous months to speculate in stocks in.",
"by": "MARK TWAIN · PUDD'NHEAD WILSON · 1894"
},
{
"t": "There are three kinds of lies: lies, damned lies, and statistics.",
"by": "MARK TWAIN, CREDITING DISRAELI · 1907"
},
{
"t": "The fault, dear Brutus, is not in our stars, but in ourselves.",
"by": "SHAKESPEARE · JULIUS CAESAR · 1599"
},
{
"t": "The heart has its reasons which reason knows nothing of.",
"by": "BLAISE PASCAL · PENSÉES · 1670"
}
]
}
};
Object.keys(QUOTE_PACKS).forEach(id => {
  const p = PRESETS[id]; if (!p) return;
  const seen = new Set(p.slogans.map(s => s[0]));
  p.slogans = p.slogans.concat(QUOTE_PACKS[id].slogans.filter(s => !seen.has(s[0])));
  const have = new Set((p.widget.archiveList || []).map(q => q.t));
  p.widget.archiveList = (p.widget.archiveList || []).concat(QUOTE_PACKS[id].archive.filter(q => !have.has(q.t)));
  p.widget.archive = true;
});

// ---------- editions ----------
// A theme can ship more than one edition. The Original is drawn in code; an Illustrated edition uses production artwork.
// New editions are added here alongside the original, never in place of it. Choosing an edition swaps its blurb and
// headlines; colorways, customize controls and everything else stay shared.
const EDITIONS = {
  longroad: [
    {id:'original',name:'Original',blurb:PRESETS.longroad.blurb,phrases:PRESETS.longroad.phrases,morePhrases:PRESETS.longroad.morePhrases},
    {id:'folio',name:"Wayfarer's Folio",blurb:'An illustrated road, carried in your pocket. Woodcut portraits, posted letters, old omens and a place by the fire.',phrases:PRESETS.longroad.phrases,morePhrases:PRESETS.longroad.morePhrases}
  ],
  rabbit: [
    {id:'original',name:'Original',blurb:PRESETS.rabbit.blurb,phrases:PRESETS.rabbit.phrases,morePhrases:PRESETS.rabbit.morePhrases},
    {id:'afterimage',name:'Afterimage',blurb:'The same impeccable thieves, seen closer. Engraved vaults, disputed heirlooms and a perfect alibi.',phrases:PRESETS.rabbit.phrases,morePhrases:PRESETS.rabbit.morePhrases}
  ],
  directive: [
    {id:'original',name:'Original',blurb:PRESETS.directive.blurb,phrases:PRESETS.directive.phrases,morePhrases:PRESETS.directive.morePhrases},
    {id:'civil-defense',name:'Civil Defense',blurb:'Shelter 9, in detail. Civilian files, sealed facilities and an emergency already filed in triplicate.',phrases:[['Remain','Inside'],['Report','For Duty'],['Return','All Forms'],['Shelter','Assigned']],morePhrases:[['Keep','Receipt'],['Trust','The Seal'],['Ration','Silence'],['Attend','The Drill'],['Submit','To Review'],['No One','Unlisted'],['Quiet','By Order'],['Filter','All Hope'],['Await','The Tone'],['Count','Your Bunk'],['Renew','Your Calm']]}
  ],
  halcyon: [
    { id: 'original', name: 'Original', blurb: 'Technocratic biotech. A wireframe globe, mint paper and lavender.', phrases: [['Mortality Is A', 'Legacy Feature'], ['Your Pulse,', 'Fully Licensed'], ['Upgrade Path:', 'Eternal'], ['Grown For What', 'Comes Next']], morePhrases: [["Consent Has", "No Expiry"], ["Memory Is", "Held In Trust"], ["Grief Requires", "Form HB-9"], ["Instinct Is", "Under Review"], ["Dreams Remain", "Company Owned"], ["Anomaly?", "File As Growth"], ["Selfhood Has", "A Lot Number"], ["Recall Applies", "To Both Copies"], ["Rest Is A", "Scheduled Test"], ["Affection Is", "Not For Resale"], ["Exit Forms", "Renew The Term"]] },
    { id: 'illustrated', name: 'Illustrated', blurb: 'Synthetic humanity. Grown organs, clinical pastels and a little more life.', phrases: [['A little', 'more life.'], ['Room', 'to feel.'], ['Breathe now.', 'Pay later.'], ['A kinder', 'second chance.']], morePhrases: [["Rest easy.", "Parts follow."], ["Settle in.", "Under glass."], ["Never lost.", "Just filed."], ["Softly made.", "Firmly held."], ["Let it grow.", "We'll name it."], ["Be curious.", "Within limits."], ["Warm voices.", "On our dial."], ["Every hour.", "Ours to give."], ["Good company", "by assignment."], ["Fewer tears.", "Same volume."], ["Care travels", "beyond you."]] }
  ],
  deeprange: [
    { id: 'original', name: 'Original', blurb: 'A long-range tracking display. Black glass, red contact frames, a yellow trajectory and a blue planet below.', phrases: [['Contact', 'Lost'], ['Signal', 'Acquired'], ['Return', 'Window'], ['Deep', 'Range']], morePhrases: [["Relay", "Silent"], ["Echo", "Delayed"], ["Vector", "Adrift"], ["Beacon", "Unlit"], ["Transit", "Pending"], ["Uplink", "Vacant"], ["Debris", "Tagged"], ["Bearing", "Unknown"], ["Docking", "Denied"], ["Last", "Voice"], ["Beyond", "Reply"]] },
    { id: 'expanded', name: 'Expanded', blurb: 'Deeper into the range. New contacts, worlds, relays and salvage, all in vector instrument art.', phrases: [['Contact', 'Lost'], ['World', 'Unresolved'], ['Carrier', 'Return'], ['Salvage', 'Window']], morePhrases: [["Dead", "Letter"], ["Tug", "Wayfarer"], ["Probe", "Long Wake"], ["Survey", "Quiet Sail"], ["Seam", "Divergence"], ["Twofold", "One Record"], ["Hollow", "Interior"], ["Saturn", "Ring Plane"], ["Neptune", "Limb"], ["N-04", "Palinode"], ["Choir", "Of Echoes"]] }
  ]
};
function editionsFor(th) { return (th && EDITIONS[th.id]) || null; }
function editionOf(th) { const e = editionsFor(th); return e ? (e.find(x => x.id === th.edition) || e[0]) : null; }
// The illustrated Halcyon renderer runs only when that edition is chosen; otherwise Halcyon is the original code-drawn theme.
// The expanded Deep Range renderer runs only when that edition is chosen; otherwise Deep Range is the original theme.
function drOn(th) { return !!th && th.motif === 'orbital' && th.edition === 'expanded'; }
// Eleven more headlines per theme/edition (lock-screen slots 5-15), written by GPT under the WORLD-BUILDING STANDARD and approved by
// Jordan (12 Oct). They're fixed copy for the exports' cycling lock screens; the four in th.phrases stay editable in Customize.
function morePhrasesFor(th) { const e = editionOf(th); return (e && e.morePhrases) || (th && PRESETS[th.id] && PRESETS[th.id].morePhrases) || []; }
function allPhrases(th) { return (th.phrases || []).concat(morePhrasesFor(th)); }
function hbOn(th) { return !!th && ['globe', 'radar'].includes(th.motif) && th.edition === 'illustrated'; }
