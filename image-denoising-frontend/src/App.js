import React from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function App() {
  const [file, setFile] = React.useState(null);
  const [originalImage, setOriginalImage] = React.useState(null);
  const [denoisedImage, setDenoisedImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true); // Start loading

    // Save the original image as a preview URL
    const reader = new FileReader();
    reader.onload = () => setOriginalImage(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/denoise", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.image_url;
      setDenoisedImage(`http://127.0.0.1:5000${imageUrl}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Image Denoising App</h1>

      {/* File Input and Denoise Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input type="file" onChange={handleFileChange} />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Denoise"}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}

      {/* Original and Denoised Images */}
      {(originalImage || denoisedImage) && (
        <div
          className="image-container"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {/* Noisy Image */}
          {originalImage && (
            <div style={{ textAlign: "center" }}>
              <h3>Noisy Image</h3>
              <img
                src={originalImage}
                alt="Noisy"
                style={{
                  maxWidth: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          )}

          {/* Denoised Image */}
          {denoisedImage && (
            <div style={{ textAlign: "center" }}>
              <h3>Denoised Image</h3>
              <img
                src={denoisedImage}
                alt="Denoised"
                style={{
                  Width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;