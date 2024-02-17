export function BugPreview({ bug }) {
  return (
    <article>
      <h4>{bug.title}</h4>
      <p>{bug.description}</p>
      <h1>🐛</h1>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      {bug.labels ? bug.labels.map((label, index) => <span key={index}>{"#" + label + " "}</span>) : ""}
    </article>
  )
}
