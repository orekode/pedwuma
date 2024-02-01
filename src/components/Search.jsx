import { useState } from "react";

import { FormControl, InputLabel, OutlinedInput, CircularProgress } from "@mui/material";
import { EmptyBox } from "components";

export const Search = ({searchingCallback = () => {}, searchCallback = () => {}, resultUi = () => {}, resetCallback = () => {}, data, isLoading, ...props }) => {

    const [ searchInput, setSearchInput ] = useState("");
    const [ inputValue,  setInputValue ]  = useState("");

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setInputValue(e.target.value);
        searchingCallback(e.target.value);
    }

    const handleSelectResult = (data) => {
        searchCallback(data, setInputValue);
        resetValues();
    }

    const resetValues = () => {
        setSearchInput("");
        // searchingCallback("");
        resetCallback();
    }

    return (
        <div className="relative z-20">
            <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">{props.label}</InputLabel>
                <OutlinedInput
                    {...props}
                    onChange={handleSearch}
                    value={inputValue}
                />
            </FormControl>
            { ( data && searchInput.replaceAll(" ", "") !== ""  ) &&

                <div className="absolute z-[20] top-[100%] SeaSearch Search rch  Search dow-xl bg-white left-0 w-full h-max">
                    <div data-aos="fade-in" className=" max-h-[250px] overflow-y-scroll z-0">
                        {data.map( (item, index) => 
                            <div key={index} onClick={() => handleSelectResult(item)}>
                                {resultUi(item)}
                            </div>
                        )}
                    </div>
                    <i onClick={resetValues} className="absolute -top-2 -right-2 bg-white h-[30px] w-[30px] flex items-center justify-center rounded-full shadow-xl hover:bg-red-500 hover:text-white z-10 bi bi-x"></i>
                </div>
            }

            {((!data || data.length <= 0) && searchInput.replaceAll(" ", "") !== "") &&
                <div className="absolute z-[20] top-[100%] shadow-xl bg-white left-0 w-full">
                    <EmptyBox classname=" h-[250px]"  load={((!data || data.length <= 0) && searchInput.replaceAll(" ", "") !== "")} title="No Results Found" text=""/>
                    <i onClick={resetValues} className="absolute -top-2 -right-2 bg-white h-[30px] w-[30px] flex items-center justify-center rounded-full shadow-xl hover:bg-red-500 hover:text-white z-10 bi bi-x"></i>
                </div>
            }

            { (!data && isLoading && searchInput.replaceAll(" ", "") !== "") &&

                <div data-aos="fade-in" className="absolute z-[20] top-[100%] shadow-xl bg-white left-0 w-full h-[250px] flex items-center justify-center">
                    <CircularProgress />
                    <i onClick={resetValues} className="absolute -top-2 -right-2 bg-white h-[30px] w-[30px] flex items-center justify-center rounded-full shadow-xl hover:bg-red-500 hover:text-white z-10 bi bi-x"></i>
                </div>
            }
        </div>
    );
}