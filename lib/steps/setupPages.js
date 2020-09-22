// Set up all our NextJS pages according to the recipes defined in pages/
const setupPages = () => {
  require("../pages/api/setup")();
  require("../pages/getInitialProps/setup")();
  require("../pages/getServerSideProps/setup")();
  require("../pages/getStaticProps/setup")();
  require("../pages/getStaticPropsWithFallback/setup")();
  require("../pages/getStaticPropsWithRevalidate/setup")();
  require("../pages/withoutProps/setup")();
};

module.exports = setupPages;
