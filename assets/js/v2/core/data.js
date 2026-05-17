export async function loadAtlasData() {
  const response = await fetch('./data.json');

  if (!response.ok) {
    throw new Error(`Failed to load data.json (${response.status})`);
  }

  return response.json();
}
