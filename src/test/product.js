import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

let data = [
  {
    id: 1,
    name: 'acs510'
  },
  {
    id: 2,
    name: 'acs580'
  }
]
export default function Product() {
  let { url } = useRouteMatch()
  return (
    <div>
      <ul>
        {
          data.map(item => (
            <li key={item.id}>
              <Link to={`${url}/detail/${item.id}`}>{item.name}</Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
