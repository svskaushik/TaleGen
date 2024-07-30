export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_GENERATION_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.images[0];
}
