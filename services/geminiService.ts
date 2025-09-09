
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        facts: {
            type: Type.OBJECT,
            properties: {
                events: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Three significant historical events that occurred on this date.",
                },
                famousBirths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Three famous people born on this date.",
                },
            },
            required: ["events", "famousBirths"],
        },
        numerology: {
            type: Type.OBJECT,
            properties: {
                lifePathNumber: {
                    type: Type.INTEGER,
                    description: "The Life Path Number calculated from the birthdate by summing and reducing the digits of the month, day, and year.",
                },
                luckyNumbers: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: "Three lucky numbers associated with the birthdate or life path number.",
                },
                luckyColors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Two lucky colors associated with the birthdate.",
                },
            },
            required: ["lifePathNumber", "luckyNumbers", "luckyColors"],
        },
        insights: {
            type: Type.OBJECT,
            properties: {
                personality: {
                    type: Type.STRING,
                    description: "A brief, positive personality insight based on the birthdate and zodiac sign, about 3-4 sentences long.",
                },
                prediction: {
                    type: Type.STRING,
                    description: "A simple, fun, horoscope-style prediction for the week ahead, about 2-3 sentences long.",
                },
            },
            required: ["personality", "prediction"],
        },
        weather: {
            type: Type.STRING,
            description: "A brief description of the typical, generalized weather for this date in the Northern Hemisphere (e.g., 'Mid-June in the Northern Hemisphere typically brings warm, sunny weather as summer begins.')",
        },
    },
    required: ["facts", "numerology", "insights", "weather"],
};


export const fetchBirthdayInsights = async (birthDate: Date): Promise<GeminiResponse> => {
    const dateString = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const monthDayString = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const prompt = `
        Analyze the birth date: ${dateString}.
        Provide a comprehensive analysis based on the following requirements and structure it as a JSON object matching the provided schema.
        
        - For historical facts, focus on the month and day (${monthDayString}), not the specific year.
        - For numerology, calculate the Life Path Number from the full birth date (${dateString}).
        - Personality insights should be positive and encouraging.
        - The prediction should be fun and lighthearted.
        - The weather should be a general description for the time of year, not specific historical data.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        // Basic validation
        if (!parsedData.facts || !parsedData.numerology || !parsedData.insights) {
            throw new Error("Invalid data structure from API");
        }
        
        return parsedData as GeminiResponse;

    } catch (error) {
        console.error("Error fetching Gemini insights:", error);
        throw new Error("Could not retrieve insights from the cosmos.");
    }
};
