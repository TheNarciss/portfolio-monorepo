import Layout from "@components/layout/Layout";
import ThreeScene from "./ThreeGraphScene";

const ThreeDemoPage = () => {
  return (
    <Layout>
      <section className="relative w-screen h-screen">
        <ThreeScene />
      </section>
    </Layout>
  );
};

export default ThreeDemoPage;
