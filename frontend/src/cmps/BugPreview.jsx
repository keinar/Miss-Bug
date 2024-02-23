export function BugPreview({ bug }) {
  return (
    <article>
      <p>{new Date(bug.createdAt).toLocaleString()}</p>
      <h4>{bug.title}</h4>
      <p>{bug.description}</p>
      <h1>🐛</h1>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      {bug.owner?.fullname && (
        <p>
          Reporter: <span>{bug.owner?.fullname}</span>
        </p>
      )}
      {bug.labels ? bug.labels.map((label, index) => <span key={index}>{"#" + label + " "}</span>) : ""}
    </article>
  )
}
