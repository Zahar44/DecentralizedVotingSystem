import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from './pages/login/Login';
import NoPage from './pages/nopage/NoPage';
import Admin from './pages/admin/Admin';
import Require from './require';
import Context from './context';
import Project from './pages/project/Project';
import { MetaMaskInpageProvider } from "@metamask/providers";
declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

function App() {
    return (
        <Routes>
            <Route element={<Context.Web3/>}>
                <Route path='/login' element={<Login/>} />
                <Route path='*' element={<NoPage/>} />

                <Route element={<Require.Login/>}>
                    <Route element={<Context.Protocol/>}>
                        <Route path='/project' element={<Project/>}/>
                        <Route path='/project/new' element={<Project createNew={true}/>}/>
                        <Route path='/project/pending' element={<Project createNew={true}/>}/>

                        <Route element={<Require.AnyPermissions/>}>
                            <Route path='/admin' element={<Admin/>}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App
