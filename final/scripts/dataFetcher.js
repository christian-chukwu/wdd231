/* Data Fetching Module - Handles API and JSON file requests */

export async function fetchData(source) {
  try {
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export function handleFetchError(error, element) {
  console.error('Data fetch error:', error);

  if (element) {
    element.innerHTML = `
      <div class="error-message" role="alert">
        <p>Sorry, we couldn't load the data. Please try refreshing the page.</p>
        <details>
          <summary>Error details</summary>
          <p>${error.message}</p>
        </details>
      </div>
    `;
  }
}
