import './style/success.css'
import { useNavigate } from 'react-router-dom'

const Success = () => {

    const navigate = useNavigate()

    const changeHandle = () => {
        navigate('/')
    }

    return (
        <>
            <div class="loader">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <div class="cup"><span className='span1'></span></div>
            </div>

            <div>
                <span className='span2'> THANKS FOR THE COFFEE</span>
            </div>

            <div class="container">
                <button onClick={changeHandle}>ONE MORE PLEASE</button>
            </div>
        </>
    )
}

export default Success