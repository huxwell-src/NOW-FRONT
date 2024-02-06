
const Header = ({ title, route, buttonConfig, children }) => {

    return (
        <div className="bg-slate-50 px-5 py-4  ">

            <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">

                {route.map((route) => (
                    route.hidden ? (
                        <>
                            <li key={route.id}>
                                <a className="text-500 no-underline line-height-3 cursor-pointer">{route.name}</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li key={route.id}>
                                <a className="text-500 no-underline line-height-3 cursor-pointer">{route.name}</a>
                            </li>
                            <li className="px-2">
                                <i className="pi pi-angle-right text-500 line-height-3"></i>
                            </li>
                        </>
                    )
                ))}

            </ul>



            <div className="flex align-items-start items-center justify-between flex-row">
                <div>
                    <div className="font-medium text-3xl text-900">{title}</div>
                </div>
                <div className="mt-3 lg:mt-0">
                    {children}
                </div>
            </div>


        </div>
    )
}

export default Header