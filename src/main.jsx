import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-cz1xfrqlz4gbz633.us.auth0.com"
      clientId="GcpBuKna5egJWpvRWTEfbKFte1mywkA8"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/userinfo',
        scope: 'openid profile email',
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
