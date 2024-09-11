import mint from "../../assets/img/menu/mint.png";
import lore from "../../assets/img/menu/lore.png";
import info from "../../assets/img/menu/info.png";
import opensea from "../../assets/img/menu/opensea.png";
import twitter from "../../assets/img/menu/twitter.png";

import s from "./Menu.module.css";
import classNames from "classnames";
import { useState } from "react";

const Menu = (props) => {
    return(
        <div className={s.menu}>
            <div className={s.nav}>
                <div className={s.social}>
                    {
                        props.socialNetworks.twitter.isActive ? 
                        <a className={s.href} href={props.socialNetworks.twitter.href} target="_blank" ><img src={twitter} alt="opensea" /></a>:
                        <div className={classNames(s.href, s.unactive)}><img src={twitter} alt="opensea" /></div>
                    }
                    {
                        props.socialNetworks.opensea.isActive ? 
                        <a className={s.href} href={props.socialNetworks.opensea.href} target="_blank" ><img src={opensea} alt="opensea" /></a>:
                        <div className={classNames(s.href, s.unactive)}><img src={opensea} alt="opensea" /></div>
                    }
                </div>
                <nav className={s.hrefs}>
                    {
                        props.socialNetworks.twitter.isActive ? 
                        <a className={s.href} href={props.socialNetworks.twitter.href} target="_blank" ><img src={twitter} alt="opensea" /></a>:
                        <div className={classNames(s.href, s.unactive)}><img src={twitter} alt="opensea" /></div>
                    }
                    <button onClick={() => {props.setType(1)}} className={classNames(s.item, {[s.active]: props.type === 1})}>
                        <img src={mint} alt="mint" />
                    </button>
                    <button onClick={() => {props.setType(2)}} className={classNames(s.item, {[s.active]: props.type === 2})}>
                        <img src={lore} alt="lore" />
                    </button>
                    <button onClick={() => {props.setType(3)}} className={classNames(s.item, {[s.active]: props.type === 3})}>
                        <img src={info} alt="info" />
                    </button>
                    {
                        props.socialNetworks.opensea.isActive ? 
                        <a className={s.href} href={props.socialNetworks.opensea.href} target="_blank" ><img src={opensea} alt="opensea" /></a>:
                        <div className={classNames(s.href, s.unactive)}><img src={opensea} alt="opensea" /></div>
                    }
                </nav>
            </div>
        </div>
    )
}

//

export default Menu;