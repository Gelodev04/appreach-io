export {};

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: {
          name?: string;
          email?: string;
        };
      }) => void;
    };
    dataLayer?: Array<{
      event?: string;
      [key: string]: any;
    }>;
    gtag?: (...args: any[]) => void;
    google_tag_manager?: any;
  }
}
