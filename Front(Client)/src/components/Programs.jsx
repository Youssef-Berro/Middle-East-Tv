import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './../css/Programs.css'

function Programs() {
    const [program, setProgram] = useState({});

    const fetchSingleProgram = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/program/fetch-single-program');
            if(resp.data.data?.Status === 'done') {
                await fetchSingleProgram();
                return; 
            }
            setProgram(resp.data.data);
        }catch(err) {
            console.log(err);
        }
    }

    const getWeekDay = (schedule) => {
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return weekdays[schedule];
    }

    const getTime = (time) => {
        const hour = (time >= 12) ? time - 12 : time;
        const meridiem = (time >= 12) ? 'PM' : 'AM';
        return `${hour === 0 ? 12 : hour}:00 ${meridiem}`;
    }


    useEffect(() => { fetchSingleProgram() }, [])

    return (
        <>
            {Object.keys(program).length !== 0 && (
                <div 
                    className="programs-container" 
                    style={{backgroundImage: `url('./../../img/programs/${program.image}')`}}
                    >
                    <div className="background-overlay"></div>
                    <div className="programs-title">Programs</div>
                    <div key={program.id} className="single-program">
                        <div className="program-img-container">
                            <img 
                                src={`./../../img/programs/${program.image}`} 
                                alt="not found" />
                            <div className="program-name">{program.name}</div>
                        </div>
                        <div className="schedule">
                                {getWeekDay(program.schedule)}, {getTime(program.time)}
                        </div>
                    </div>
                    <button onClick={fetchSingleProgram} >next program</button>
                </div>
            )}
        </>
    )
}

export default Programs