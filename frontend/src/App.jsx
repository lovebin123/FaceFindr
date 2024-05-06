import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Facedetector from './pages/Facedetector';
import { Meteors } from "./components/ui/meteors";
function App() {
    return (
        <div className='App'>
           
            <ChakraProvider>
            
                <Routes>
                    {/* Define the layout for paths starting with "/dash" */}
                    <Route path="/dash/*" element={<Layout />} />
                    {/* Define the home page */}
                    <Route path='home' element={<Facedetector />} />
                </Routes>
            </ChakraProvider>
        </div>
    );
}

export default App;
