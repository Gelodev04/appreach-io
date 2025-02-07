import axios from 'axios';
import { finalizeUpload, getSignedUrl } from 'src/services/gcloud';

const uploadFileToSignedUrl = async (file: File, signedUrl: string) => {
  try {
    const response = await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return response.status === 200 ? response : null;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

export const handleFileUpload = async (form: FormData) => {
  try {
    const file = form.get('file') as File;

    // Step 1: Get signed URL
    const signedUrl = await getSignedUrl(file.name);

    // Step 2: Upload file directly to Cloud Storage
    if (!signedUrl.url) {
      console.error('Signed URL is not available');
      return { error: 'Signed URL not available.' };
    }

    const response = await uploadFileToSignedUrl(file, signedUrl.url);

    // Step 3: Finalize the upload only if the upload was successful
    if (!response) {
      console.error('File upload failed. Skipping finalizeUpload.');
      return { error: 'File upload failed.' };
    }

    const permanentUrlData = await finalizeUpload(file.name);
    return { url: permanentUrlData.url };
  } catch (error) {
    console.error('Error on uploading file:', error);
    return { error: 'Error on getting signed url.' };
  }
};
