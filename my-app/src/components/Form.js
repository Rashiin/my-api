import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Form = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("FileDetails", data.file[0]);
    formData.append("FileType", data.fileType);

    try {
      const saveFileResponse = await axios.post("http://localhost:5000/PostSingleFile", formData);
      console.log("File saved successfully:", saveFileResponse.data);

      const emailData = {
        subject: data.subject,
        body: data.body,
        attachmentPath: saveFileResponse.data.filePath,
      };

      const emailResponse = await axios.post("http://localhost:5000/api/email", emailData);
      console.log("Email sent successfully:", emailResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)} style={{ background: "linear-gradient(to bottom, #ff6699, #aa66cc)" }}>
      <label className="form-label">
        Subject:
        <input {...register("subject")} className="form-input" />
      </label>

      <label className="form-label">
        Body:
        <textarea {...register("body")} className="form-input" />
      </label>

      <label className="form-label">
        File:
        <input type="file" {...register("file")} className="form-input" />
      </label>

      <button type="submit" className="form-button">
        Submit
      </button>
    </form>
  );
};
export default Form;
