import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from 'recoil';

createRoot(document.getElementById('root')).render(
 
    <Auth0Provider
      domain="dev-ob2zgf2rb2cj4emu.us.auth0.com"
    clientId="PKriUy3BJCzcEQzBVZGG0dKjlCaXEyEs"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
     <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
    
    </StrictMode>
    </Auth0Provider>,
);
