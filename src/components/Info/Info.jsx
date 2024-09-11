import info_desktop from "../../assets/img/info_desktop.png";
import info_mobile from "../../assets/img/info_mobile.png";

import s from "./Info.module.css";

const Info = (props) => {
    return(
        <section className={s.info}>
            <div className={s.img}>
                <img src={info_desktop} alt="info" />
                <img src={info_mobile} alt="info" />
            </div>
        </section>
    )
}

export default Info;