class LoginData {
  phone = process.env.USER_PHONE!;
  password = process.env.USER_PASSWORD!;
}

export default new LoginData();
