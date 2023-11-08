import "./Project.css";
import Header from "./header/Header";
import Voting from "./voting/Voting";
import Context from "../../context";
import CreateProjectModal from "./create-project/CreateProjectModal";
import { useNavigate } from "react-router-dom";

export interface ProjectProps {
    createNew?: boolean;
}

function Project({ createNew }: ProjectProps) {
    const navigate = useNavigate();

    return (
        <Context.VotingPower>
            <div className="layout">
                <Header/>
                <Voting/>
            </div>
            <CreateProjectModal isOpen={createNew === true} onRequestClose={() => navigate('project')}/>
        </Context.VotingPower>
    )
}

export default Project;
