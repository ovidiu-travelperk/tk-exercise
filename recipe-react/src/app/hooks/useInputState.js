import React, { useState, useEffect } from 'react'

export const useInputState = (defaultValueFn) => {
    const [state, setState] = useState(defaultValueFn)

    const handleChange = (e) =>{
        setState(e.target.value)
    }

    const reset = () =>{
        setState(defaultValueFn);
    }

    return [state, handleChange, reset];
}