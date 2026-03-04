

export default function Button({children, type, isDisabled = false}) {

    return (
        <button type={type} disabled={isDisabled}>
            {children}
        </button>
    )
}