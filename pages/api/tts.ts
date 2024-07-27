import { NextApiRequest, NextApiResponse } from 'next';
import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;

      const request = {
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Neural2-D' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await client.synthesizeSpeech(request);
      const audioContent = response.audioContent;

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename=narration.mp3');
      res.send(Buffer.from(audioContent));
    } catch (error) {
      console.error('Error in text-to-speech API:', error);
      res.status(500).json({ error: 'Failed to synthesize speech' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
