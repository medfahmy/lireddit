import { UserInput } from "../resolvers/user";

export const validateRegister = (credentials: UserInput) => {
  if (!credentials.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (credentials.username.length < 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (credentials.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (credentials.password.length < 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }
  return null;
};
