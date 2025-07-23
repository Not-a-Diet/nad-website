const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
    config: {
      theme: {
        light: {
          colors: {
            primary100: "#e6f9ec",
            primary200: "#b8eac7",
            primary500: "#27ae60", // main green
            primary600: "#219150",
            primary700: "#1a7a3c",
            danger700: "#b72b1a", // you can also customize other colors
          },
        },
        dark: {
          // You can also override dark mode colors here
        },
      },
    },
    bootstrap() {},
  config,
  bootstrap,
};
