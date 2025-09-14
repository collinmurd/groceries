export default function ErrorHandler(props) {
    return (<div>
      {props.error ? <ErrorPage message={props.error}/> : props.children}
    </div>);
}
function ErrorPage(props) {
    return (<div>
      <h2>{props.message}</h2>
    </div>);
}
//# sourceMappingURL=ErrorHandler.jsx.map