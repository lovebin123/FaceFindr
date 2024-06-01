import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Facedetector from './pages/Facedetector';
import { Meteors } from "./components/ui/meteors";
import Facegallary from "./pages/Facegallary";
import ParticleEffect from "./components/ui/particle";
function App() {
    return (
        <div className='App'>
           <ParticleEffect />
            <ChakraProvider>
            
                <Routes>
                    {/* Define the layout for paths starting with "/dash" */}
                    <Route path="/*" element={<Layout />} >
                    {/* Define the home page */}
                    <Route path='/*' element={<Facedetector />} />
                    <Route path="photo" element={<Facegallary/>}/>
                    </Route>
                </Routes>
            </ChakraProvider>
        </div>
    );
}

export default App;
