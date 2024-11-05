import Onboarding from "../components/Onboarding";
import OrderStatusSelector from "../components/OrderStatusSelector";


const PlaygroundPage = () => {
  // return <Onboarding />;

  return (
    <OrderStatusSelector onChange={console.log} />

  )
};

export default PlaygroundPage;
