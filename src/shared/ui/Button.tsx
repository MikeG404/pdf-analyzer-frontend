

export default function Button({children, type, isDisabled = false, onClick = () => {}}) {

    return (
        <button onClick={onClick} type={type} disabled={isDisabled}>
            {children}
        </button>
    )
}