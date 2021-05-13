import * as yup from "yup";

import { messages } from "../lang";

export const registrationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, messages.register.emailNotLongEnough)
    .email(messages.register.invalidEmail),
  password: yup.string().min(3, messages.register.passwordNotLongEnough).max(255).required(),
});
