import { finalizeUpload, getSignedUrl } from 'src/services/gcloud';

import axios from 'axios';

const uploadFileToSignedUrl = async (file: File, signedUrl: string) => {
  try {
    const response = await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    console.log('File successfully uploaded!', response.status);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export const handleFileUpload = async (form: FormData) => {
  const file = form.get('file') as File;

  // Step 1: Get signed URL
  const signedUrl = await getSignedUrl(file.name);

  // Step 2: Upload file directly to Cloud Storage
  if (signedUrl.url) {
    await uploadFileToSignedUrl(file, signedUrl.url);
  } else {
    console.error('Signed URL is not available');
  }

  // Step 3: Finalize the upload and get the permanent URL
  const permanentUrlData = await finalizeUpload(file.name);
  console.log('Permanent URL:', permanentUrlData.url);
};
