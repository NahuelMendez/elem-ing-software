import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { searchState } from "../../slices/searchSlice";
import { searchTextState, setSearchResults } from "../../slices/searchSlice";
import NavBar from "../Navbar";
import PizzeriaCard from "../UI/PizzeriaCard";

import api from "../../Api/ApiObject"

const OrderByDropdown = ({handleChange}) => {
  const [value, setValue] = useState('NAME')
  
  const localHandleChange = event => {
    event.preventDefault()
    setValue(event.target.value)
    handleChange(event.target.value)
  }
  
  return (
    <form className = "w-4/5 d-flex justify-content-end mt-2">
      <label>Ordenar por:</label>
      <select name="orderBy" value={value} onChange={localHandleChange}>
        <option value="NAME"></option>
        <option value="MOST_CHEAP">Mas economica</option>
      </select>
    </form>
  )
}

const SearchResult = () => {
  const results = useSelector(searchState)
  const searchText = useSelector(searchTextState)
  const dispatch = useDispatch()

  const handleOrderByChange = newOrderCriteria => {
    api.searchPizzeria({ name: searchText, orderBy: newOrderCriteria }).then(res => {
      dispatch(setSearchResults({
        searchText,
        results: res.data
      }))
    })
  }

  return (
    <div className="w-full flex flex-col pb-8 items-center">
      <div className="w-full">
        <NavBar />
      </div>
      <div className="w-5/6" >
        {results.length === 0 && <p className="text-lg text-center mt-8 text-gray-500">No se encontraron pizzerías que coincidan.</p>}
        {results.length > 0 && <OrderByDropdown handleChange={handleOrderByChange}/>}
        <div className="flex flex-wrap justify-center">
        {results && results.map((pizzeria, index) => (
          <PizzeriaCard key={index} name={pizzeria.name} />
        ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
