
import React, { useEffect, useRef, useState } from 'react'

const VerifyOTP = () => {

    const otpLength = new Array(6).fill("");
    const [input,setInput] = useState(otpLength);
    const ref = useRef([]);
    const [timer, setTimer] = useState(30);

    const OnchangeHandler = (value,idx) => {
        if(isNaN(value)) return;
        const newInput = [...input];
        newInput[idx] = value;
        setInput(newInput);

        if(value && idx < otpLength.length){
            ref.current[idx + 1]?.focus();
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer((prev) => prev - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const onKeyDownHandler = (e,idx) => {
        console.log(e.key);
        if(e.key === "Backspace" && !input[idx]){
            ref.current[idx - 1].focus();
        }
    }


  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-200'>
        <div className='shadow-xl bg-white rounded-2xl px-8 md:px-12 py-8'>
            <h2 className='text-center mb-5 text-2xl md:text-3xl font-semibold text-gray-600'>OTP Verification</h2>
            <div className='flex items-center gap-2 md:gap-4 flex-wrap'>
                {
                    input.map((i,idx) => (
                        <input 
                            ref={(el) => ref.current[idx] = el}
                            type="text"
                            key={idx}
                            maxLength={1}
                            className='w-10 h-10 md:w-12 md:h-12 text-center text-3xl text-fuchsia-400 font-semibold rounded border border-fuchsia-700 outline-fuchsia-600'
                            value={input[idx]}
                            onChange={(e) => OnchangeHandler(e.target.value, idx)}
                            onKeyDown={(e) => onKeyDownHandler(e,idx)}
                         />
                    ))
                }
            </div>
            <div className='text-center mt-5'>
                {timer > 0 ? <p>Resend OTP in <strong>{timer}</strong> seconds</p> : <button className='cursor-pointer px-4 py-2 rounded bg-cyan-500 text-white font-semibold'>Resend OTP</button>}
            </div>
        </div>
    </div>
  )
}

export default VerifyOTP