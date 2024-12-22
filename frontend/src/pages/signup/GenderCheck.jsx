// React icons
import { IoIosMan } from "react-icons/io";
import { IoIosWoman } from "react-icons/io";

const GenderCheck = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex mb-2">
      <div className="form-control mr-2">
        <label htmlFor="male-checkbox" className={`label gap-2 cursor-pointer ${selectedGender === "male" ? 'selected' : ''}`}>
          <span className="inline-flex items-center label-text"><IoIosMan className="mr-1" title="Man icon" /> Male</span>
          <input
            type="checkbox"
            id="male-checkbox"
            className="checkbox border-slate-900"
            checked={selectedGender === "male"}
            onChange={()=> onCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label htmlFor="female-checkbox" className={`label gap-2 cursor-pointer ${selectedGender === "female" ? 'selected' : ''}`}>
          <span className="inline-flex items-center label-text"><IoIosWoman className="mr-1" title="Woman icon" /> Female</span>
          <input
            type="checkbox"
            id="female-checkbox"
            className="checkbox border-slate-900"
            checked={selectedGender === "female"}
            onChange={()=> onCheckboxChange("female")}
          />
        </label>
      </div>
    </div>
  )
}

export default GenderCheck