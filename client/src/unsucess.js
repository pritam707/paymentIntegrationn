import './style/unsuccess.css'
import { useNavigate } from 'react-router-dom'

const Unsuccess = () => {

    const navigate = useNavigate()
    const changeHandle = () => {
        navigate('/')
    }

    return (
        <div className="bd">
            <p className='p4'> <span>PAYMENT UNSUCESSFUL</span></p>
            <div className='shape'>
                <div class="contenedor">
                    <div class="cat">
                        <div class="cola"></div>
                        <div class="legs3"></div>
                        <div class="legs7"></div>

                        <div class="body"><div class="legs"><div class="legs9"></div></div></div>
                        <div class="orejas"></div>
                        <div class="orejas3"></div>
                        <div class="cara">
                            <div class="ojos"><div class="iris"></div></div>
                            <div class="ojos3"><div class="iris3"></div></div>
                            <div class="ceja"></div>
                            <div class="ceja3"></div>
                            <div class="bigotitos"></div>
                            <div class="bigotitos3"></div>
                            <div class="boca"></div>
                            <div class="hocico3"></div>
                            <div class="hocico"></div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="container2">
                <button onClick={changeHandle}>TRY AGAIN</button>
            </div>
        </div>
    )
}

export default Unsuccess