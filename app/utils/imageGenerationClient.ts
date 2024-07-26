export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch('https://stablediffjm93xzi2jo-2a7ea2eb749f41aa.tec-s1.onthetaedgecloud.com/sdapi/v1/txt2img', {
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
