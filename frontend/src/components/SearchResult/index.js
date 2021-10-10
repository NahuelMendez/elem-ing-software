import { useSelector } from "react-redux";
import { searchState } from "../../slices/searchSlice";
import NavBar from "../Navbar";
import PizzeriaCard from "../UI/PizzeriaCard";

const SearchResult = () => {
  const results = useSelector(searchState)

  return (
    <div className="w-full flex flex-col pb-8 items-center">
      <div className="w-full">
        <NavBar />
      </div>
      <div className="w-5/6 flex flex-wrap justify-center">
        {results.length === 0 && <p className="text-lg mt-8 text-gray-500">No se encontraron pizzerías que coincidan.</p>}
        {results && results.map(i => (
          <PizzeriaCard name={i.name} />
        ))}
      </div>
    </div>
  )
}

export default SearchResult