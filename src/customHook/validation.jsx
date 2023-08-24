export default function validate(value, type) {
  let errors;
  switch (type) {
    case "username":
      if (!value || !value?.trim()) errors = "Name is required!";
      break;
    case "email":
      if (!/\S+@\S+\.\S+/.test(value)) {
        errors = "Email address is invalid";
      }
      if (!value || !value?.trim()) {
        errors = "Email address is required";
      }
      break;
    case "password":
      if (value.length < 6) {
        errors = "Pass word must more than 6 characters!";
      }
      break;
    default:
      return errors;
  }
  return errors;
}
