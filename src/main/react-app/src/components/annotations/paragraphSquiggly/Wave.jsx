export default function Wave(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="10" preserveAspectRatio="none">
            <path d="M0 5 q10 10 20 0 q10 -10 20 0" stroke={props.stroke} fill="transparent"/>
        </svg>
    );
}
