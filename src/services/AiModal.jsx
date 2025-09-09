import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// ✅ safe JSON parser (backup ke liye rakho)
function safeJsonParse(raw) {
  try {
    if (typeof raw === "object") return raw;

    let text = String(raw)
      .replace(/```(?:json)?/g, "") // remove ```json or ```
      .replace(/[\x00-\x1F\x7F]/g, "") // remove hidden chars
      .trim();

    const start = text.search(/[{\[]/);
    const end = text.lastIndexOf(text.includes("{") ? "}" : "]") + 1;
    if (start !== -1 && end > start) text = text.slice(start, end);

    return JSON.parse(text);
  } catch (e) {
    console.error("❌ JSON parse failed:", e.message);
    return null;
  }
}

export async function generateTravelPlan(formdata) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `generate the travel plan for location ${formdata.destination}, 
        for ${formdata.days} days for ${formdata.travelWith} with a ${formdata.budget} budget. 
        Give me:
        1. Hotels list (hotel name, address, price, image url, geo coordinates, rating, description) 
        2. Itinerary with day wise plan (place name, details, image, geo coordinates, ticket pricing, travel time, best time to visit) 
        in JSON format only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            location: { type: "string" },
            duration: { type: "string" },
            traveler_type: { type: "string" },
            budget: { type: "string" },
            hotels: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hotel_name: { type: "string" },
                  address: { type: "string" },
                  price: { type: "string" },
                  image_url: { type: "string" },
                  geo_coordinates: { type: "string" },
                  rating: { type: "number" },
                  description: { type: "string" }
                },
                required: [
                  "hotel_name",
                  "address",
                  "price",
                  "image_url",
                  "geo_coordinates",
                  "rating",
                  "description"
                ]
              }
            },
            itinerary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  plan: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        place_name: { type: "string" },
                        details: { type: "string" },
                        image: { type: "string" },
                        geo_coordinates: { type: "string" },
                        ticket_pricing: { type: "string" },
                        travel_time: { type: "string" },
                        best_time_to_visit: { type: "string" }
                      },
                      required: [
                        "place_name",
                        "details",
                        "image",
                        "geo_coordinates",
                        "ticket_pricing",
                        "travel_time",
                        "best_time_to_visit"
                      ]
                    }
                  }
                },
                required: ["day", "plan"]
              }
            }
          },
          required: [
            "location",
            "duration",
            "traveler_type",
            "budget",
            "hotels",
            "itinerary"
          ]
        }
      }
    });

    // ✅ Gemini will try to return JSON matching schema
    const parsed = safeJsonParse(response.text);
    // console.log("✅ Parsed Travel Plan:", JSON.stringify(parsed, null, 2));

    return parsed;
  } catch (error) {
    console.error("❌ Error generating travel plan:", error);
    return null;
  }
}
