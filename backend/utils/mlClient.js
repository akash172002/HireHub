import axios from "axios";

export const getMatchScore = async (resumeText, jobText) => {
  const { data } = await axios.post("http://127.0.0.1:8000/match", {
    resume_text: resumeText,
    job_text: jobText,
  });

  return data;
};
