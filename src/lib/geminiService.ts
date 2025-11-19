import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBmCBMa2oYj3Gz5vD4VVbmzbQjkstrp0g4");

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[];
  isEdited?: boolean;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class GeminiService {
  private model;
  
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async sendMessage(
    message: string,
    images?: File[],
    language: string = "en",
    chatHistory: Message[] = []
  ): Promise<string> {
    try {
      const parts: any[] = [];
      
      const languageInstructions = this.getLanguageInstructions(language);
      
      if (chatHistory.length > 0) {
        const historyContext = chatHistory
          .slice(-10)
          .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
          .join("\n");
        parts.push({ text: `Previous conversation:\n${historyContext}\n\n` });
      }

      if (images && images.length > 0) {
        for (const image of images) {
          const imageData = await this.fileToGenerativePart(image);
          parts.push(imageData);
        }
      }

      parts.push({ 
        text: `${languageInstructions}\n\nUser message: ${message}\n\nPlease provide a helpful and detailed response. If the question involves coding, provide well-formatted code with explanations. If you need to search the internet for current information, mention that and provide the best answer you can based on your knowledge.` 
      });

      const result = await this.model.generateContent(parts);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }

  private getLanguageInstructions(language: string): string {
    switch (language) {
      case "hi":
        return "कृपया हिंदी में जवाब दें। स्पष्ट और सहायक बनें।";
      case "hinglish":
        return "Please respond in Hinglish (Hindi-English mix). Aap Hindi aur English dono mix karke baat kar sakte hain. Be clear and helpful.";
      case "indian-english":
        return "Please respond in Indian English style. Use familiar terms and expressions commonly used in India. Be clear and helpful.";
      default:
        return "Please respond in clear English. Be helpful and detailed.";
    }
  }

  private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const audioFile = new File([audioBlob], "audio.mp3", { type: "audio/mp3" });
      const audioPart = await this.fileToGenerativePart(audioFile);
      
      const result = await this.model.generateContent([
        audioPart,
        { text: "Please transcribe this audio accurately." }
      ]);
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio. Please try again.");
    }
  }
}

export const geminiService = new GeminiService();

export const loadChatSessions = (): ChatSession[] => {
  const stored = localStorage.getItem("ai-chat-sessions");
  if (!stored) return [];
  try {
    const sessions = JSON.parse(stored);
    return sessions.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }));
  } catch {
    return [];
  }
};

export const saveChatSessions = (sessions: ChatSession[]) => {
  localStorage.setItem("ai-chat-sessions", JSON.stringify(sessions));
};

export const createNewSession = (): ChatSession => {
  return {
    id: Date.now().toString(),
    name: `Chat ${new Date().toLocaleString()}`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
