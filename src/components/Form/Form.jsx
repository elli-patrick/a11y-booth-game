import { useRef, useState } from "react";
import "./Form.css";
import { addUser } from "../../firebase/database";
import { checkEmail, checkNickname, createUniqueNameForDB, errors } from "./form-utils";

function Form({ onStart, isFirstTime, isDarkTheme }) {
  const nicknameRef = useRef(null);
  const emailRef = useRef(null);
  const [formFieldsValidation, setFormFieldsValidation] = useState({
    isNicknameValid: true,
    isEmailValid: true,
  });

  const handleEmailInput = () => {
    const lowercaseValue = emailRef.current.value.toLowerCase();
    emailRef.current.value = lowercaseValue;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const nicknameValue = nicknameRef.current.value;
    const isNicknameValid = checkNickname(nicknameValue);
    const isEmailValid = checkEmail(emailValue);

    if (isEmailValid && isNicknameValid) {
      const name = createUniqueNameForDB(emailValue);
      const newUser = await addUser(name, nicknameValue);
      onStart(newUser);
    } else {
      setFormFieldsValidation({
        ...formFieldsValidation,
        isNicknameValid,
        isEmailValid,
      });
      if (!isNicknameValid) {
        nicknameRef.current.focus();
      } else {
        emailRef.current.focus();
      }
    }
  };

  return (
    <section className="form-section">
      <div id="form-description" className="explanation">
        <h2 className="instructions-title">Instructions</h2>
        <p>Match the question with the answer as fast as you can</p>
        <div className="keyboard">
          <p>Use only the keyboard</p>
          <img src="/no-mouse.jpeg" alt="no mouse" className="mouse" />
        </div>
        <p>
          <span className="ninja">Ninja challenge</span> - use a screen reader{" "}
          <span aria-hidden="true">&#128584;</span>
        </p>
        <figure>
          <img src={isDarkTheme ? "/example-dark.png" : "/example-light.png"} alt="" />
          <figcaption>Match Example</figcaption>
        </figure>
        
      </div>

      <form
        role="form"
        aria-labelledby="form-title"
        aria-describedby="form-description"
        className="form-container"
        noValidate="novalidate"
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <h2 className="form-title" id="form-title">
          To start fill in your info
        </h2>
        <div className="input-container">
          <label htmlFor="nickname">
            Nickname <span aria-hidden="true" className="small-font">{`(required)`}</span>
          </label>
          <input
            id="nickname"
            ref={nicknameRef}
            type="text"
            aria-required="true"
            aria-invalid={!formFieldsValidation.isNicknameValid}
            aria-describedby="nickname-error"
            autoFocus={!isFirstTime}
          />
          {!formFieldsValidation.isNicknameValid && (
            <p id="nickname-error" className="error small-font">
              {errors.nickname}
            </p>
          )}
        </div>
        <div className="input-container">
          <label htmlFor="email">
            Email <span aria-hidden="true" className="small-font">{`(required)`}</span>
          </label>
          <input
            id="email"
            ref={emailRef}
            type="email"
            aria-required="true"
            aria-invalid={!formFieldsValidation.isEmailValid}
            aria-describedby="email-error"
            onInput={handleEmailInput}
          />
          {!formFieldsValidation.isEmailValid && (
            <p id="email-error" className="error small-font">
              {errors.email}
            </p>
          )}
        </div>
        <button className="form-btn">Start Game!</button>
      </form>
    </section>
  );
}

export default Form;
