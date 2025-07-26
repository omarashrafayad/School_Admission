import { createSlice } from '@reduxjs/toolkit'


interface tooglemenu {
    Menu: boolean
}

const initialState: tooglemenu = {
    Menu: false
}

export const menuslice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        ToogleMenu: (state) => {
            if (state.Menu === false) {
                state.Menu = true
            }
            else {
                state.Menu = false
            }
        }
    }
})
export const { ToogleMenu } = menuslice.actions
export default menuslice.reducer