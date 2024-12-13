// React icons
import { BsSearch } from "react-icons/bs";

const SearchInput = () => {
  return (
    <form className="flex items-center gap-2">
      <input type="text" placeholder="Search..." id="search-input" className="input input-bordered rounded-full" />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <BsSearch className="w-6 h-6 outline-none" />
      </button>
    </form>
  )
}

export default SearchInput