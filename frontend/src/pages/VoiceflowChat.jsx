import React, { useEffect } from 'react';

const VoiceflowChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
    script.type = "text/javascript";
    
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID: '672b62fb673ad3993b94b6da' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    };
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default VoiceflowChat;
