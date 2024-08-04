const form = document.getElementById('pdfForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  output.textContent = 'Processing PDF...';

  const formData = new FormData();
  const file = document.getElementById('pdfFile').files[0];

  if (!file) {
    output.textContent = 'Please select a PDF file.';
    return;
  }

  formData.append('pdf', file);

  try {
    const response = await fetch('http://localhost:5500/process-pdf', { // Update URL to match your server
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error('Error processing PDF: ' + errorMessage);
    }

    const data = await response.json(); // Assuming the response is JSON

    if (data.error) {
      output.textContent = `Error: ${data.error}`;
    } else if (data.downloadUrl) { // Check for downloadUrl property in response
      const downloadLink = document.createElement('a');
      downloadLink.href = data.downloadUrl;
      downloadLink.download = 'processed_pdf.pdf'; // Adjust filename as needed
      downloadLink.textContent = 'Download Processed PDF';
      document.body.appendChild(downloadLink);
      downloadLink.click(); // Simulate click to trigger download
      document.body.removeChild(downloadLink); // Clean up

      output.textContent = 'PDF processed successfully!';
    } else {
      output.textContent = 'Unexpected response from server.';
    }
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
    console.error('Error processing PDF:', error); // Log the error for debugging
  }
});
