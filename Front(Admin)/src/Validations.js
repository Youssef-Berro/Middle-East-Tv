import { toast } from "react-toastify"
import { mapTime, mapWeekDay } from "./functions";

const isEmpty = (attrbVal, attrbName) => {
    if(attrbVal.length === 0) {
        toast.error(`${attrbName} cannot be empty`);
        return true;
    }

    return false;
}

const isMoreThanMaxLen = (attrbVal, maxLen, attrbName) => {
    if(attrbVal.length >= maxLen) {
        toast.error(`${attrbName} cannot be more than ${maxLen} character`)
        return true;
    }

    return false;
}

const isMoreThanMaxNum = (attrbVal, maxNum, attrbName) => {
    if(attrbVal >= maxNum) {
        toast.error(`${attrbName} must be lower than ${maxNum}`)
        return true;
    }

    return false;
}

const isNegativeNum = (attrbVal, attrbName) => {
    if(attrbVal <= 0) {
        toast.error(`${attrbName} cannot be negative or 0`);
        return true;
    }

    return false;
}


const validUrl = (url) => {
    const pattern = /^(https?:\/\/)?([\w-]+\.)*([\w-]+\.\w{2,})+(\/[\w-]+\/?)*(\?\S*)?(#\S*)?$/;

    if(!pattern.test(url)) {
        toast.error('invalid url format');
        return false;
    }

    return true;
}

const validDate = (attrbVal, attrbName) => {
    const parts = attrbVal.split('/');
    const date = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
    const currDate = new Date();

    if(date < currDate) {
        toast.info(`${attrbName} must be in the future`);
        return false;
    }

    return true;
}

const validWeekDay = (day) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if(!weekDays.includes(day)) {
        toast.error(`invalid week day value must be Monday, Tuesday, 
                    Wednesday, Thursday, Friday, Saturday or Sunday`)

        return false;
    }

    return true;
}

const validClock = (time) => {
    const times = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM',
                    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
                    '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']


    if(!times.includes(time)) {
        toast.error(`invalid time format`);
        return false;
    }

    return true;
}

const checkImageSize = (file) => {
    return new Promise((res, rej) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const aspectRatio = img.width / img.height;

                if (Math.abs(aspectRatio - 16 / 9) < 0.01)  res(true);
                else {
                    toast.error('image size must be 16:9');
                    rej(false);
                }
            }
        }

        reader.readAsDataURL(file);
        reader.onerror = (err) => {
            rej(false);
        }
    })
}

const duplicateRowMsg = (str) => {
    const regex = /\((\d+), (\d+)\)/;
    const match = str.match(regex);

    toast.error(`already there is a program at ${mapTime(parseInt(match[2], 10))} 
                in ${mapWeekDay(parseInt(match[1], 10))}`);
}


const isSyntaxIncorrect = (errorMessage) => {
    if(errorMessage.includes('Incorrect syntax'))
        return true;

    return false;
}

export {
    isEmpty,
    isMoreThanMaxLen,
    isMoreThanMaxNum,
    isNegativeNum,
    validUrl,
    validDate,
    validWeekDay,
    validClock,
    checkImageSize,
    duplicateRowMsg,
    isSyntaxIncorrect
}