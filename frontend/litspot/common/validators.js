import * as EmailValidator from 'email-validator'

function validateEmail (email) {
  return EmailValidator.validate(email)
}

export { validateEmail }
