// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/";

// export async function analyzeProduct(file: File) {
//   const formData = new FormData();
//   formData.append("image", file);

//   const response = await fetch(`${API_BASE}/api/scan`, {
//     method: "POST",
//     body: formData,
//   });

//   console.log("STATUS:", response.status);
//   console.log("CONTENT-TYPE:", response.headers.get("content-type"));

//   const text = await response.text();

//   console.log("RAW RESPONSE START -----");
//   console.log(text);
//   console.log("RAW RESPONSE END -----");

//   let data;

//   try {
//     data = JSON.parse(text);
//   } catch {
//     console.error("invalid JSON response:", text);
//     throw new Error(
//       "Server returned an invalid response. Check backend route or server logs.",
//     );
//   }

//   if (!response.ok || !data.success) {
//     throw new Error(data.message || "Unable to analyze this product.");
//   }

//   return data;
// }

const API_BASE = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function analyzeProduct(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Unable to connect to the analysis service. Please try again.",
    );
  }

  if (!response.ok || !data.success) {
    const raw = data?.message || "";

    // Hide ugly Gemini / backend errors from users
    if (
      raw.includes("models/") ||
      raw.includes("NOT_FOUND") ||
      raw.includes("generateContent") ||
      raw.includes("v1beta") ||
      raw.includes("503") ||
      raw.includes("high demand")
    ) {
      throw new Error(
        "AI analysis is temporarily unavailable. Please try again in a few moments.",
      );
    }

    throw new Error(raw || "Unable to analyze this product.");
  }

  return data;
}
