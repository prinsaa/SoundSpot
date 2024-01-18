# SoundSpot

Introducing **SoundSpot** – where music meets mystery 🎶🔍

SoundSpot (inspired by Spotify): the place to discuss anything related to music completely anonymously! Make a post, write comments, share likes...all while remaining identity-free. Be as bold, as mysterious, or as expressive as you want – your secret music alter ego awaits. But that's not all 🙈.

Unleash the power of the ultimate musical search engine. Connect your Spotify account to:

- See YOUR **top 10 artists** \*
- See YOUR **top 10 tracks** \*
- Search for _ANY_ artists' **top ten tracks** \*

at anytime...no need to wait until December (sorry Spotify 😆)!

This full-stack application was created with the following specs:

**Frotend:**

- Framework: React
- Build Tool: Vite
- Styling: Chakra UI
- Authentication: OAuth with Spotify API
- API Requests: Axio
- Routing: React Router
- Responsive Design: _coming soon_

**Backend:**

- Framework: Supabase

**Music Data and OAuth:**

- Data Source: Spotify API
- Access Control: OAuth 2.0 with Spotify API
- Scopes: user-top-read

Deployment was done using Netlify as github pages is a static hosting service. The following code was added to a file named \_redirects located in the app's _public_ folder to overcome a presistent 404 issue after a user logs in to Spotify:

/\* /index.html 200

\*based on data from Canada Spotify
