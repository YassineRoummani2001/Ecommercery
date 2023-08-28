export default function TileComponent({data , selected = [] , onClick}) {
  return (
      <>
      {
          data && data.length ? 
          <div className="mt-3 flex flex-wrap items-center gap-4 justify-between" >
              {
                  data.map(dataItem =>(
                      <label onClick={()=>onClick(dataItem)} key={dataItem.id} 
                      className={`cursor-pointer text-black mb-4 px-6 py-2 ${selected && selected.length && selected.map(item => 
                          item.id).indexOf(dataItem.id) !== -1 ? ' bg-black rounded-lg border shadow-xl ' : ''} `} 
                      >
                          <span 
                          className={`rounded-lg border mb-4 border-black  px-6 py-2 font-bold   ${selected && selected.length && selected.map(item => 
                              item.id).indexOf(dataItem.id) !== -1 ? ' text-white' : ''} `} 
                          >
                              {dataItem.label}
                          </span>
                      </label>
                  ))
              }
          </div> 
          :null
      }
      </>
  )
}