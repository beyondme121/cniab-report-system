import React from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'

export default function ProductDetail() {
  let { id } = useParams()
  let { url, path } = useRouteMatch()
  console.log("url: ", url, "path: ", path)
  return (
    <div>
      from Product component param: {id}, {path}
    </div>
  )
}
