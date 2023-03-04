import React, {useMemo, useContext} from 'react';
import {useImmer} from 'use-immer';
import * as initialState from '../initial-state.json';

export default function makeStore() {
    const context = React.createContext();

    const Provider = ({children, initialState }) => {
        const [state, setState] = useImmer(initialState);

        const contextValue = useMemo(() => [state, setState], [state]);

        return <context.Provider value={contextValue}>{children}</context.Provider>;
    };

    const useStore = () => useContext(context);

    return {
        Provider,
        useStore
    }
};
