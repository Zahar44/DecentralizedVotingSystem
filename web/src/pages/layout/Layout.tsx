import "./Layout.css";
import Header from "./header/Header";
import Voting from "./voting/Voting";
import Context from "../../context";

function Layout() {
    return (
        <Context.VotingPower>
            <div className="layout">
                <Header/>
                <Voting/>
            </div>
        </Context.VotingPower>
    )
}

export default Layout;
