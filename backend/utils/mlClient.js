import axios from "axios";

export const getMatchScore = async (resumeText, jobText) => {
  const { data } = await axios.post(`${process.env.ML_SERVICE_URL}/match`, {
    resume_text: resumeText,
    job_text: jobText,
  });

  return data;
};
