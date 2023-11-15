export default function BubbleWrapper({
    ...otherProps
}) {
    return (
        <>
            <div className="bubbles-wrapper">
                <div className="bubbles-container">
                    <div className="bubbles-container-element">
                        {...otherProps.children}
                    </div>
                </div>
                <ul className="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </>
    )
}