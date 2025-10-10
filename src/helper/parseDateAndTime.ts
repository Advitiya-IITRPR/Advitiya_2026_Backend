

export const parseDateAndTime = (dateStr: string, timeStr: string) =>{
    const [day, month, year] = dateStr.split("/").map(Number);
    
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
}