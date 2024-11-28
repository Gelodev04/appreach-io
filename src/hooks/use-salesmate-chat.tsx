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
  const prefillMessage = (message: string) => {
    if (!window.SALESMATE) {
      console.log('Salesmate is not initialize.');
    }

    window.SALESMATE?.showNewMessage(message);
  };

  return { prefillMessage };
};

export default useSalesmateChat;
