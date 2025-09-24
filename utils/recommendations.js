// utils/recommendations.js

export async function fetchRecommendations(lastViewed) {
  try {
    const res = await fetch(
      "https://v8sqbz8rgj.execute-api.us-east-2.amazonaws.com/default/getRecommendations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastViewed }),
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch recommendations:", res.status);
      return [];
    }

    const data = await res.json();
    return data.recommendations || [];
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
}
