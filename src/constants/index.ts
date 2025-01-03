export const defaultEngagementSettings = {
  key: 'defaultEngagementSettings',
  engagementSettings: {
    scrollMessage: 100,
    markImportant: 100,
    removeSpam: 100,
    movePrimary: 100,
    clickLink: 100,
    linksToClick: ['download', 'apply'],
    linksNotToClick: ['unsubscribe', 'do not contact'],
    filterId: null,
    replyMessage: 100,
    replyPrompt:
      "Write a professional, friendly, and engaging reply to a cold email. The response should express interest in the sender's proposal or service, show appreciation for their outreach, and ask a thoughtful follow-up question to keep the conversation going. Use a tone that is warm and approachable but professional. Ensure the reply sounds personalized and tailored to the email content, referencing specific details provided by the sender. Here’s the original cold email: {email_content}",
  },
};
