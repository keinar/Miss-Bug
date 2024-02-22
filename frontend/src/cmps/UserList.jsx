import { Link } from "react-router-dom"
import { UserPreview } from "./UserPreview"
import { useSelector } from "react-redux"

export function UserList({ onRemoveUser, onEditUser }) {
  const users = useSelector(storeState => storeState.userModule.users)
  return (
    <ul className="bug-list">
      {users.map(user => (
        <li className="bug-preview" key={user._id}>
          <UserPreview user={user} />
          <div>
            <button
              onClick={() => {
                onRemoveUser(user._id)
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditUser(user)
              }}
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
