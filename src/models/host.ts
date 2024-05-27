import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  timezone: { type: String },
  crypt: { type: String, unique: true },

  instantly_workspace: { type: String },
  instantly_api_key: { type: String },

  smartlead_api_key: { type: String },
  smartlead_webhook: { type: String },

  auto_cc_active: { type: Boolean, default: false },
  has_custom_auto_cc_message: { type: Boolean, default: false },
  auto_cc_message: { type: String, default: '' },
  cc_name: { type: String },
  cc_address_string: { type: String },
  cc_address_array: { type: [String] },
  pronoun_1: { type: String },
  pronoun_2: { type: String },

  notification_address_string: { type: String },
  notification_address_array: { type: [String] },

  total_sent: { type: Number },
  total_received: { type: Number },
  counts_last_updated: { type: Date },

  slack_channel_id: { type: String },

  warmup_tags: { type: [String], default: [] },

  external_sender_addresses: { type: [String], default: [] },

  auto_exclude_addresses: { type: [String], default: [] },
  auto_exclude_usernames: { type: [String], default: [] },
  auto_exclude_domains: { type: [String], default: [] },

  do_not_contact_sheet_url: { type: String },
  do_not_contact_addresses: { type: [String], default: [] },
  do_not_contact_domains: { type: [String], default: [] },

  engagement_remove_spam: { type: Boolean, default: false },
  engagement_mark_important: { type: Boolean, default: false },
  engagement_reply_message: { type: Boolean, default: false },
  engagement_move_primary: { type: Boolean, default: false },
  engagement_click_link: { type: Boolean, default: false },
  engagement_download_message: { type: Boolean, default: false },
  engagement_scroll_message: { type: Boolean, default: false },
});

export const Host = mongoose.model('Host', hostSchema);
