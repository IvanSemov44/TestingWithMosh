import Onboarding from "../components/Onboarding";
import SearchBox from "../components/SearchBox";


const PlaygroundPage = () => {
  // return <Onboarding />;


  return <SearchBox onChange={(text)=>console.log(text)}/>
};

export default PlaygroundPage;
