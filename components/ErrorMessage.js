export function ErrorMessage(props) {
  return (
    <div className="rounded-md bg-red-300 mt-8 p-3 px-4">
      <span>
        <b>Error:</b> {props.message}
      </span>
    </div>
  );
}
