import { useState } from "react";
import validate from "./validation";

const useInput = (inputType) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    const checkError = validate(e.target.value, inputType);
    setError(checkError);
    setTouched(true);
  };

  const reset = () => {
    setValue("")
  }

  return {
    value,
    error,
    touched,
    reset,
    onBlur,
    onChange: handleChange,
  };
};

export default useInput;
