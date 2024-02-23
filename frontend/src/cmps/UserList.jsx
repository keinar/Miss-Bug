import { Link } from "react-router-dom"
import { UserPreview } from "./UserPreview"
import { useSelector } from "react-redux"

export function UserList({ onRemoveUser, onEditUser }) {
  const users = useSelector(storeState => storeState.userModule.users)
  return (
    <ul className="user-list">
      {users.map(user => (
        <li className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div>
            {user.bugsCount === 0 && (
              <button
                onClick={() => {
                  onRemoveUser(user._id)
                }}
              >
                x
              </button>
            )}
            <button
              onClick={() => {
                onEditUser(user)
              }}
            >
              Edit
            </button>
            <button>
              <Link to={`/user/${user._id}`}>Details</Link>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
