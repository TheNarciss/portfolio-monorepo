import Layout from "@components/layout/Layout";
import PageWrapper from "@components/layout/PageWrapper";
import ThreeScene from "@components/threeDemo/ThreeGraphScene";

const Visualization: React.FC = () => {
  return (
    <Layout>
      <PageWrapper zoom="out">
        <div className="w-screen h-screen">
          <ThreeScene />
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default Visualization;
