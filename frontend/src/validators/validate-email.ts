function isEmailValid(email: string): boolean {
  //* / - The start of the regular expression
  //* ^ - Match the start of the string
  //* [^\s@]+ - Match one or more characters that are not whitespace or the "@" symbol (this is the local part of the email address, before the "@")
  //* @ - Match the "@" symbol
  //* [^\s@]+ - Match one or more characters that are not whitespace or the "@" symbol (this is the domain name of the email address, before the first dot)
  //* \. - Match the first dot in the domain name
  //* [^\s@]+ - Match one or more characters that are not whitespace or the "@" symbol (this is the first level of the domain name, after the first dot)
  //* (\.[^\s@]+)* - Match zero or more occurrences of a dot followed by one or more characters that are not whitespace or the "@" symbol (this allows for domain names with multiple levels, separated by dots)
  //* $ - Match the end of the string
  //* / - The end of the regular expression

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;
  return regex.test(email);
}

export function validateEmail(email: string): { isValid: boolean; errorMessage?: string } {
  if (!isEmailValid(email)) {
    return { isValid: false, errorMessage: "email does not conform to standard" };
  }

  return { isValid: true };
}
