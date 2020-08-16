const nodemailer = require("nodemailer");
const config = require("config");

module.exports = async (email, res, url) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "kurila28@mail.ru",
      pass: config.get("mailPassword")
    }
  });

  try {
    await transporter.sendMail({
      from: `"simpleContact" <${transporter.options.auth.user}>`,
      to: email,
      subject: "Reset password",
      html: `Hi!<br/><br/>You made a request to change the password.<strong>Follow the link</strong> to set a new password.<br/><hr/>${url}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
