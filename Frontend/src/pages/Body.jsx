
import React from 'react'
import { useSelector } from 'react-redux'

const Body = () => {

  let {user} = useSelector((state) => state.user)


  return (
    <div>Body</div>
  )
}

export default Body