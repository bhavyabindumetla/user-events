import React from 'react'
import Axios from 'axios'
import { Dialog, CircularProgress } from '@material-ui/core'
import UserModal from './UserModal'
import './table.css'

export function Users(props) {
  const [users, setUsers] = React.useState([])
  const [user, setUser] = React.useState({})
  const [open, setOpen] = React.useState(false)

  // fetching data
  React.useEffect(() => {
    Axios.get('http://127.0.0.1:3001/members')
      .then((res) => {
        console.log('res', res?.data)
        setUsers(res?.data)
      })
  }, [])

  const onUserClick = (data) => {
    setOpen(true)
    setUser(data)
  }

  const onClose = () => {
    setOpen(false)
  }
console.log('users', users)
  return (
    <div className="table-root">
      {!users.length ? <CircularProgress /> :(
        <>
          <table>
            <tr>
              <th>ID</th>
              <th>Real Name</th>
              <th>Time Zone</th>
            </tr>
            {
              users.map((user) => (
                <tr onClick={() => onUserClick(user)}>
                  <td>
                    {user?.id}
                  </td>
                  <td>
                    {user?.real_name}
                  </td>
                  <td>
                    {user?.tz}
                  </td>
                </tr>
              ))
            }
          </table>
          <Dialog open={open} onClose={onClose} aria-labelledby="customized-dialog-title">
            <UserModal onClose={onClose} user={user} />
          </Dialog>
        </>
      )}
    </div>
  )
}