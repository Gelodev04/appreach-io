import { useEffect } from 'react';

// Extend the Window interface to include salesmateSettings and loadwidget
declare global {
  interface Window {
    salesmateSettings?: {
      workspace_id: string;
      app_key: string;
      tenant_id: string;
    };
    SALESMATE?: any;
  }
}

const useSalesmateChat = () => {
  useEffect(() => {
    // Set Salesmate settings on the window object
    window.salesmateSettings = {
      workspace_id: process.env.NEXT_PUBLIC_SALESMATE_WORKSPACE_ID as string,
      app_key: process.env.NEXT_PUBLIC_SALESMATE_APIKEY as string,
      tenant_id: process.env.NEXT_PUBLIC_SALESMATE_ID as string,
    };

    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `
    !function(e,t,a,i,d,n,o){
      e.Widget=i,
      e[i]=e[i]||function(){
        (e[i].q=e[i].q||[]).push(arguments)
      },
      n=t.createElement(a),
      o=t.getElementsByTagName(a)[0],
      n.id=i,
      n.src=d,
      window._salesmate_widget_script_url=d,
      n.async=1,
      o.parentNode.insertBefore(n,o)
    }(window,document,"script","loadwidget", "${process.env.NEXT_PUBLIC_SALESMATE_ID}/messenger-platform/messenger-platform-main.js"),
    loadwidget("init",{}),
    loadwidget("load_widget","Widget Loading...!");
  `;
  }, []);

  const prefillMessage = (message: string) => {
    if (!window.SALESMATE) {
      console.log('Salesmate is not initials');
    }

    window.SALESMATE?.showNewMessage(message);
  };

  return { prefillMessage };
};

export default useSalesmateChat;
