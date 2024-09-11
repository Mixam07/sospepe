import { compose } from "redux";
import { connect } from 'react-redux';
import Home from "./Home";
import { getSettingsThunkCreator } from "../../redux/reducers/settings-reducer";
import { useEffect } from "react";

const HomeContainer = (props) => {
    useEffect(() => {
        props.getSettingsThunkCreator()
        setInterval(() => {
            props.getSettingsThunkCreator();
        }, 1000);
    }, [])

    return <Home {...props} />
}

const mapStateToProps = (state) => ({
})

export default compose(
    connect(mapStateToProps, { getSettingsThunkCreator }),
)(HomeContainer)