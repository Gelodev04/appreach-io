'use client';

import { useEffect, useRef } from 'react';

type CalendlyProps = {
  name?: string;
  email?: string;
};

export const Calendly = ({ name, email }: CalendlyProps) => {
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'calendly-widget-script';

    const existingScript = document.getElementById(scriptId);

    const initCalendly = () => {
      if (window.Calendly && calendlyRef.current?.children.length === 0) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/outreachmagic/onboarding?hide_gdpr_banner=1',
          parentElement: calendlyRef.current!,
          prefill: {
            name,
            email,
          },
        });
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    } else {
      initCalendly();
    }
  }, [name, email]);

  return <div ref={calendlyRef} style={{ width: '100%', minWidth: '320px', height: '800px' }} />;
};
