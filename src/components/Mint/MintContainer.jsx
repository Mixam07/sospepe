import { compose } from "redux";
import { connect } from 'react-redux';
import Mint from "./Mint";
import { setAddress } from "../../redux/reducers/settings-reducer";

const mapStateToProps = (state) => ({
    isSaleOpen: state.settingsReducer.isSaleOpen,
    address: state.settingsReducer.address,
    walletList: state.settingsReducer.walletList,
})

export default compose(
    connect(mapStateToProps, { setAddress: setAddress }),
)(Mint)