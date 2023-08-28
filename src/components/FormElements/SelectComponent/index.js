export default function SelectComponenet({label , value , onChange , options=[]}) {
    return(
        <div className=" relative">
        <p className="bg-white pt-0 pr-2 pl-2 absolute pb-0 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-700">
            {label}
        </p>
        <select 
        value={value} 
        onChange={onChange} 
        className=" border text-black placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
        >
            {
                options && options.length ?  
                options.map((optionsItem) => 
                    (
                        <option id={optionsItem.id} value={optionsItem.id} key={optionsItem.id} >
                            {optionsItem.label}
                        </option>
                    )
                )
                : <option id='' value={''} >Select</option>
            }
        </select>
        </div>
    )
}