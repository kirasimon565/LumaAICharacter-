import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { ModelConfig } from "../types";

// NOTE: In a real environment, we would use the specific model path.
// Since WebLLM requires pre-compiled weights (Wasm), we're using a compatible mapped model ID
// that represents the "LumaAI-160M-v3" for demonstration of the API integration.
// If custom weights are hosted, they would be added to the appConfig.
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f32_1-MLC"; 

class LumaLLM {
  private engine: MLCEngine | null = null;
  public isLoaded = false;
  public loadingProgress = 0;

  async initialize(onProgress: (progress: number) => void) {
    if (this.engine) return;

    try {
      this.engine = await CreateMLCEngine(
        MODEL_ID,
        {
          initProgressCallback: (report) => {
            const p = report.progress * 100;
            this.loadingProgress = p;
            onProgress(p);
          },
        }
      );
      this.isLoaded = true;
      console.log("LumaLLM Engine Loaded");
    } catch (err) {
      console.error("Failed to load WebLLM engine", err);
      throw err;
    }
  }

  async generateResponse(
    prompt: string, 
    systemPrompt: string, 
    config: ModelConfig,
    onStream: (partial: string) => void
  ) {
    if (!this.engine) throw new Error("Model not initialized");

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: prompt }
    ];

    const chunks = await this.engine.chat.completions.create({
      messages,
      temperature: config.temperature,
      top_p: config.top_p,
      stream: true,
      presence_penalty: config.repetition_penalty, 
    });

    let fullText = "";
    for await (const chunk of chunks) {
      const delta = chunk.choices[0]?.delta?.content || "";
      fullText += delta;
      onStream(fullText);
    }
    return fullText;
  }
}

export const lumaLLM = new LumaLLM();