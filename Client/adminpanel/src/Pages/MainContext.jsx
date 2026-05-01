import React, { createContext, useEffect, useState } from 'react'

export const AdminContext = createContext();

export default function MainContext({ children }) {

    const [edit, Setedit] = useState(JSON.parse(localStorage.getItem('edit'))||[]);

    useEffect(() => {

        localStorage.setItem('edit', JSON.stringify(edit))

    }, [edit])


    const data = { edit, Setedit};

    return (

        <>
            <AdminContext.Provider value={data}>
                {children}
            </AdminContext.Provider>
        </>

    )
}