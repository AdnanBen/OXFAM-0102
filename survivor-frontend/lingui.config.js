/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  // English and Chichewa
  locales: ["en", "ny"],
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
};
