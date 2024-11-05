import { Toaster } from "react-hot-toast";
import Onboarding from "../components/Onboarding";
import ToastDemo from "../components/ToastDemo";


const PlaygroundPage = () => {
  // return <Onboarding />;

  return (
    <>
      <ToastDemo />
      <Toaster />
    </>
  )
};

export default PlaygroundPage;
