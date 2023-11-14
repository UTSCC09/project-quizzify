export default function BubbleWrapper({
    ...otherProps
}) {
    return (
        <>
            <div class="bubbles-wrapper">
                <div class="bubbles-container">
                    <div class="bubbles-container-element">
                        {...otherProps.children}
                    </div>
                </div>
                <ul class="bg-bubbles">
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