import lore from "../../assets/img/lore.png";

import s from "./Lore.module.css";

const Lore = (props) => {
    return(
        <section className={s.lore}>
            <div className={s.img}>
                <img src={lore} alt="lore" />
            </div> 
        </section>
    )
}

export default Lore;