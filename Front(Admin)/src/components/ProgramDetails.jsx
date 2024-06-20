import React, { useEffect, useState } from 'react'
import './../css/UpdatePage.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { mapTime, mapTimeToNum, mapWeekDay, mapWeekDayToNum } from '../functions'
import { checkImageSize, duplicateRowMsg, isEmpty, 
        isMoreThanMaxLen, isSyntaxIncorrect, validClock, validWeekDay } from '../Validations'

function ProgramDetails() {
    const navigate = useNavigate();
    const params = useParams();
    const [programData, setProgramData] = useState({});

    const [name, setName] = useState("");
    const [nameInput, setNameInput] = useState(false);

    const [schedule, setSchedule] = useState("");
    const [scheduleInput, setScheduleInput] = useState(false);

    const [time, setTime] = useState("");
    const [timeInput, setTimeInput] = useState(false);


    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/api/program/get-program-by-id/${params.id}`);
                setProgramData(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchProgram();
    }, [params])


    useEffect(() => {
        if(Object.keys(programData).length !== 0) {
            setName(programData.name);
            setSchedule(programData.schedule);
            setTime(programData.time);
        }
    }, [programData])


    const updateName = async () => {
        if((isEmpty(name, 'name')) || (isMoreThanMaxLen(name, 200, 'name')))   return;

        try {
            setNameInput(false);
            await axios.patch(`http://localhost:8000/api/admin/program/${params.id}`, {
                name: name}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setProgramData({...programData, name: name});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Name Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }


    const updateImage = async (e) => {
        try {
            const image = e.target.files[0];
            const formData = new FormData();
            const imgName = `${Date.now()}_${image.name}`;
            formData.append('image', image, imgName);

            const isValidImg = await checkImageSize(image);
            if(!isValidImg)  return;


            await axios.patch(`http://localhost:8000/api/admin/program/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            setProgramData({ ...programData, image: imgName });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Image Updated',
                showConfirmButton: false,
                timer: 1000
            })
        } catch (err) {
            console.log(err);
        }
    }


    const updateSchedule = async () => {
        if(!validWeekDay(schedule))   return;
        const scheduleNum = mapWeekDayToNum(schedule);

        try {
            setScheduleInput(false);

            await axios.patch(`http://localhost:8000/api/admin/program/${params.id}`, {
                schedule: scheduleNum}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })


            setProgramData({...programData, schedule: scheduleNum});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Day Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(msg.includes('duplicate'))   duplicateRowMsg(msg);
            else   toast.error('error')
        }
    }


    const updateTime = async () => {
        if(!validClock(time))   return;
        const timeNum = mapTimeToNum(time);


        try {
            setTimeInput(false);

            await axios.patch(`http://localhost:8000/api/admin/program/${params.id}`, {
                time: timeNum}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setProgramData({...programData, time: timeNum});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Clock Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(msg.includes('duplicate'))   duplicateRowMsg(msg);
            else   toast.error('error')
        }
    }


    const dropProgram = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/program/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            navigate('/homepage');
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Program Deleted',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            console.log(err);
        }
    }


    return (
        <>
            {Object.keys(programData).length !== 0 && 
                <div className='details-page-container'>
                    <div className="details-page-head">
                        {!nameInput ? (
                            <>
                                <div className="details-page-title">{programData.name}</div>
                                <button
                                    onClick={() => {setNameInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <div className='edit-input-container'>
                                <input
                                    onChange={(e) => {setName(e.target.value)}}
                                    defaultValue={programData.name}
                                    type="text"
                                    autoFocus={true}/>
                                <div className='edit-input-functionality'>
                                    <button 
                                        onClick={() => {setNameInput(false)}}
                                        className='cancel-btn'>cancel</button>
                                    <button
                                        onClick={updateName}
                                        className='save-btn'>save</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="details-page-img-container">
                        <img
                            className="details-page-img" 
                            src={`./../../img/programs/${programData.image}`} 
                            alt="not found" />
                        <form encType='multipart/form-data'>
                            <input
                                onChange={updateImage}
                                id="fileInput"
                                type="file"
                                accept="image/jpeg, image/png"/>
                            <label htmlFor="fileInput">
                                choose another image
                            </label>
                        </form>
                    </div>
                    <div className="category-name-container">
                        {!scheduleInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Week Day :</span>
                                    <span className="category-name">{mapWeekDay(programData.schedule)}</span>
                                </div>
                                <button
                                    onClick={() => {setScheduleInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Week Day  :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setSchedule(e.target.value)}}
                                        defaultValue={mapWeekDay(programData.schedule)}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setScheduleInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateSchedule}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="specific-category-name-container">
                        {!timeInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">At :</span>
                                    <span className="category-name">{mapTime(programData.time)}</span>
                                </div>
                                <button
                                    onClick={() => {setTimeInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">At :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setTime(e.target.value)}}
                                        defaultValue={mapTime(programData.time)}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setTimeInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateTime}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='edit-page-btns-container'>
                        <button 
                            onClick={() => navigate(-1)}
                            className="log-in-btn back-btn">Back</button>
                        <button
                            onClick={dropProgram}
                            className="log-in-btn drop-btn">Drop Program</button>
                    </div>
                </div>
            }
        </>
    )
}

export default ProgramDetails