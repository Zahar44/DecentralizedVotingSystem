import "./Layout.css";
import VotingPowerProvider from "../protocol/VotingPower";
import Header from "./header/Header";
import Voting from "./voting/Voting";

function Layout() {
    return (
        <VotingPowerProvider>
            <div className="layout">
                <Header/>
                <Voting/>
            </div>
        </VotingPowerProvider>
    )
}

export default Layout;
