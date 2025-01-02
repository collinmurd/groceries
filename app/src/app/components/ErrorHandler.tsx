
export default function ErrorHandler(props: { children: React.ReactNode, error: string | null }) {
  return (
    <div>
      {props.error ? <ErrorPage message={props.error} /> : props.children}
    </div>
  )
}

function ErrorPage(props: {message: string}) {
  return (
    <div>
      <h2>{props.message}</h2>
    </div>
  )
}
