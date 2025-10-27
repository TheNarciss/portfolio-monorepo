import Layout from "@components/layout/Layout";
import ThreeScene from "@components/threeDemo/ThreeGraphScene";

const Visualization = () => {
  return (
    <Layout>
      <div className="w-screen h-screen">
        <ThreeScene />
      </div>
    </Layout>
  );
};

export default Visualization;