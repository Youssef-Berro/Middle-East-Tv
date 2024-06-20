import React, { useState, useEffect } from 'react'
import './../css/Insert.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { mapTimeToNum, mapWeekDayToNum } from '../functions';
import { checkImageSize, duplicateRowMsg, isEmpty, 
        isMoreThanMaxLen, isSyntaxIncorrect, validClock, validWeekDay } from '../Validations';

function InsertProgram() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [image, setImg] = useState(null);
    const [schedule, setSchedule] = useState("");
    const [time, setTime] = useState(null);


    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    const createProgramReq = async () => {
        const imgName = `${Date.now()}_${image.name}`;
        const isValidImg = await checkImageSize(image);

        if((isEmpty(name, "name")) || (isMoreThanMaxLen(name, 200, "name")))   return;
        if(!validWeekDay(schedule))   return;
        if(!validClock(time))   return;
        if(!isValidImg)  return;


        try {
            const scheduleNum = mapWeekDayToNum(schedule);
            const timeNum = mapTimeToNum(time);
            const formData = new FormData();

            formData.append('name', name);
            formData.append('image', image, imgName);
            formData.append('schedule', scheduleNum);
            formData.append('time', timeNum);

            await axios.post("http://localhost:8000/api/admin/program", formData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : `Bearer ${sessionStorage.getItem('token')}`
                }
            })


            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Program Created',
                showConfirmButton: false,
                timer: 1000
            })
            navigate('/homepage');
        }catch(err) {
            const msg = err.response.data.message;

            if(msg.includes('duplicate'))   duplicateRowMsg(msg);
            else if(isSyntaxIncorrect(msg)) toast.error(msg);
            else   toast.error('error')
        }
    }



    const handleProgramImage = async (e) => {setImg(e.target.files[0])}

    return (
        <div className="insert-program-container">
            <div className="form">
                    <div className="insert-form-title">Enter new Program Data :</div>
                    <div className="form-data">
                        <div className="form-section1-program">
                            <input 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="name" 
                                type="text" />
                            <form encType='multipart/form-data'>
                                <input 
                                    id="fileInput"
                                    type="file"
                                    className='insert-new-obj-image'
                                    accept="image/jpeg, image/png"
                                    onChange={handleProgramImage}/>
                                <label htmlFor="fileInput">
                                    choose program image
                                </label>
                            </form>
                        </div>
                        <div className="form-section2">
                            <input
                                onChange={(e) => setSchedule(e.target.value)}
                                placeholder="week day" 
                                type="text" />
                            <input
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="time" 
                                type="text" />
                            <div className='insert-btns-container'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="log-in-btn discard-btn">Discard</button>
                                <button 
                                    onClick={createProgramReq}
                                    className="log-in-btn create-btn">Create</button>
                            </div>
                        </div>
                    </div>

            </div>
        </div>
    )
}

export default InsertProgram