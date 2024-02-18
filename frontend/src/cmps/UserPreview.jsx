export function UserPreview({ user }) {

    return <article >
        <h4>{user.username}</h4>
        <h1>{user.fullname}</h1>
        <p>Score: <span>{user.score}</span></p>
    </article>
}