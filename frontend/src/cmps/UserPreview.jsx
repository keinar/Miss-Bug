export function UserPreview({ user }) {
  return (
    <article>
      <h4>{user.fullname}</h4>
      <p>
        Username: <span>{user.username}</span>
      </p>
      <p>
        Score: <span>{user.score}</span>
      </p>
      <p>
        Bugs Count: <span>{user.bugsCount}</span>
      </p>
    </article>
  )
}
