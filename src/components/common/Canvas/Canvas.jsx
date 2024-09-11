import s from "./Canvas.module.css";
import { Transition } from "react-transition-group";
import classNames from "classnames";

const Canvas = (props) => {
    const classGenerator = (state) => {
        if(state === "entering") return "animate__animated animate__fadeIn"
        else if(state === "exiting") return "animate__animated animate__fadeOut"
    }

    return(
        <Transition
        in={props.isShow}
        timeout={500}
        mountOnEnter
        unmountOnExit
        >
            {state => 
            <div onClick={props.onClick} className={classNames(classGenerator(state), s.canvas)}>
                <div className={s.popup}>{props.children}</div>
            </div>}
        </Transition>
    )
}

export default Canvas;