import React, { Suspense } from 'react'
import ResetPassword from '../components/reset-password/reset-password'

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <ResetPassword />
      </Suspense>
    </div>
  )
}
