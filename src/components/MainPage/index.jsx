import Header from "../Header";
import SearchInput from "../SearchInput";

function MainPage() {
  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
    </div>
  );
}

export default MainPage;
