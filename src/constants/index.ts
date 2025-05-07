import { nanoid } from 'nanoid';

export const defaultEngagementSettings = {
  key: 'defaultEngagementSettings',
  engagementSettings: {
    scrollMessage: 100,
    markImportant: 100,
    removeSpam: 100,
    movePrimary: 100,
    clickLink: 100,
    linksToClick: [],
    linksNotToClick: [],
    filterId: nanoid(5),
    disableFilterId: false,
    replyMessage: 100,
    replyPrompt:
      'Write an engaging reply, express interest, show appreciation, and ask a thoughtful follow-up question. Don’t always use the most natural words and provide personal examples.',
    useEventSenders: true,
  },
};

export const espData = {
  'google business': {
    esp: 'google business',
    espCamelCase: 'googleBusiness',
    server: 'google',
  },
  'microsoft business': {
    esp: 'microsoft business',
    espCamelCase: 'microsoftBusiness',
    server: 'microsoft',
  },
  'google personal': {
    esp: 'google personal',
    espCamelCase: 'googlePersonal',
    server: 'google',
  },
  'microsoft personal': {
    esp: 'microsoft personal',
    espCamelCase: 'microsoftPersonal',
    server: 'microsoft',
  },
};
