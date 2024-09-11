import { compose } from "redux";
import { connect } from 'react-redux';
import Menu from "./Menu";

const mapStateToProps = (state) => ({
    socialNetworks: state.settingsReducer.socialNetworks,
})

export default compose(
    connect(mapStateToProps, {}),
)(Menu)