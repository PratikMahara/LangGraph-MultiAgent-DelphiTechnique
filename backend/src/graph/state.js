export const graphState = {
  question: "",

  gpt: "",
  deepseek: "",
  nvidia: "",
  gemini: "",

  gpt_refined: "",
  deepseek_refined: "",
  nvidia_refined: "",
  gemini_refined: "",

  gpt_confidence: 0,
  deepseek_confidence: 0,
  nvidia_confidence: 0,
  gemini_confidence: 0,

  // ✅ ADD THESE (CRITICAL)
  gpt_preferred: null,
  deepseek_preferred: null,
  nvidia_preferred: null,
  gemini_preferred: null,

  finalAnswer: "",
  bestModel: "",
  refinedAnswers: []
};