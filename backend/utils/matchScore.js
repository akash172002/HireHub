/**
 * Resume–job match score using TF-IDF + cosine similarity (pure JS, no external ML service).
 * Same behaviour as the previous Python ML service: returns match_score (0–100) and recommended (true if >= 60).
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it",
  "its", "of", "on", "that", "the", "to", "was", "were", "will", "with", "the", "this", "but",
  "they", "have", "had", "what", "when", "where", "which", "who", "your", "you", "i", "we", "our",
]);

function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function termFreq(tokens) {
  const tf = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  return tf;
}

function vocab(tf1, tf2) {
  const v = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  return [...v];
}

function idf(docCount, docFreq) {
  return Math.log((docCount + 1) / (docFreq + 1)) + 1;
}

function tfIdfVector(tf, vocabulary, idfScores) {
  return vocabulary.map((term) => {
    const tfVal = tf[term] || 0;
    const idfVal = idfScores[term] || 1;
    return tfVal * idfVal;
  });
}

function dot(a, b) {
  return a.reduce((s, x, i) => s + x * (b[i] || 0), 0);
}

function norm(v) {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return n || 1;
}

function cosineSimilarity(vecA, vecB) {
  const d = dot(vecA, vecB);
  return d / (norm(vecA) * norm(vecB));
}

/**
 * Compute match score between resume text and job text.
 * @param {string} resumeText - Raw text from resume (e.g. from PDF).
 * @param {string} jobText - Combined job title + description + skills.
 * @returns {{ match_score: number, recommended: boolean }}
 */
export function getMatchScore(resumeText, jobText) {
  const tokens1 = tokenize(resumeText);
  const tokens2 = tokenize(jobText);
  if (tokens1.length === 0 || tokens2.length === 0) {
    return { match_score: 0, recommended: false };
  }

  const tf1 = termFreq(tokens1);
  const tf2 = termFreq(tokens2);
  const vocabulary = vocab(tf1, tf2);

  const docCount = 2;
  const idfScores = {};
  for (const term of vocabulary) {
    let df = 0;
    if (tf1[term]) df += 1;
    if (tf2[term]) df += 1;
    idfScores[term] = idf(docCount, df);
  }

  const vec1 = tfIdfVector(tf1, vocabulary, idfScores);
  const vec2 = tfIdfVector(tf2, vocabulary, idfScores);

  const similarity = cosineSimilarity(vec1, vec2);
  const scorePercent = Math.round(Math.max(0, Math.min(1, similarity)) * 10000) / 100;
  const recommended = scorePercent >= 60;

  return {
    match_score: scorePercent,
    recommended,
  };
}
