import { Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState();
  const handleSearch = (newValue) => {
    if (newValue) {
      navigate("/search/" + newValue);
    }
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <div className="flex justify-center mt-5">
      <Select
        size="large"
        className="w-6/12 mx-auto"
        aria-placeholder="Search"
        showSearch
        value={value}
        placeholder={"Search..."}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      />
    </div>
  );
};

export default SearchBar;
