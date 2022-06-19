export default function ErrorMessage(props) {
    return <div className="bg-white rounded-md bg-red-300 p-3 px-4">
        <span><b>Error:</b> { props.message }</span>
    </div>
}
