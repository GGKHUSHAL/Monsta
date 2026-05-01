"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ToastContainer } from 'react-toastify'

export default function MainRootFile({ children }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer position="top-right" autoClose={2000} />
    </Provider>
  )
}
