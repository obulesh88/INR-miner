module.exports = {
  siteUrl: "https://www.inrminer.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.8,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
