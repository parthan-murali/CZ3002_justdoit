import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../PagesCSS/Feedback.css";
import FormTextArea from "../Components/FormTextError";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import emailjs from "emailjs-com";

function Feedback() {
  const initialValues = {
    name: "",
    email: "",
    message: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    message: Yup.string().required("Required"),
  });

  function sendEmail(content) {
    emailjs.send("gmail", "feedback", content, "oHVWubkS14mRrJvSS").then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
  }

  const feedbackCollectionRef = collection(db, "feedback");
  const onSubmit = async (values, actions) => {
    await addDoc(feedbackCollectionRef, {
      timestamp: serverTimestamp(),
      values,
    })
      .then(() => {
        sendEmail(values);
        alert("Feedback received!\nThank you for your feedback!");
        actions.resetForm();
      })
      .catch((err) => {
        console.log("Error: ", err);
        alert("Submission unsuccessful.");
      });
  };

  return (
    <div className="feedback-form-container">
      <p className="feedback-form-title">FEEDBACK</p>
      <p className="feedback-form-p">We'd love to hear your feedback!</p>
      <hr color="black" size="1.2" width="320px" style={{ margin: "auto" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <div className="feedback-form">
          <Form>
            <div className="feedback-form-control">
              <label className="feedback-form-label" htmlFor="name">
                Name:
              </label>
              <Field
                className="feedback-form-field"
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name e.g. John"
              />
              <ErrorMessage component={FormTextArea} name="name" />
            </div>

            <div className="feedback-form-control">
              <label className="feedback-form-label" htmlFor="email">
                Email:
              </label>
              <Field
                className="feedback-form-field"
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email e.g. John@example.com"
              />
              <ErrorMessage component={FormTextArea} name="email" />
            </div>

            <div className="feedback-form-control">
              <label className="feedback-form-label" htmlFor="message">
                Message:
              </label>
              <Field
                className="feedback-form-field feedback-message-field"
                as="textarea"
                id="message"
                name="message"
                placeholder="Enter Message e.g The app was..."
              />
              <ErrorMessage component={FormTextArea} name="message" />
            </div>
            <div className="feedback-form-control">
              <button className="feedback-form-submit-button" type="submit">
                Submit
              </button>
            </div>
          </Form>
        </div>
      </Formik>
    </div>
  );
}

export default Feedback;
