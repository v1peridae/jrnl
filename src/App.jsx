import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Journal from './pages/journal';
import { AuthProvider } from './components/AuthContxt'; 
import ProtectedRoute from './components/routestuff'; 
import SharedEntry from './components/SharedEntry';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/journal'
                        element={
                            <ProtectedRoute>
                                <Journal />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/shared/:entryId' element={<SharedEntry />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;