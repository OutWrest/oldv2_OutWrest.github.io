import Container from 'react-bootstrap/Container';
import Background from './Background';
import './Title.css'

function Title() {
    return (
        <Container>
            <div className="title text">
                <h1>Salah Abbas</h1>
            </div>
            <div className="title">
                <Background />
            </div>
        </Container>
    );
}

export default Title;