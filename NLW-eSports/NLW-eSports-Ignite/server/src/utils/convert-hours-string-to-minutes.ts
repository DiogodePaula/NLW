export function converte(hourString:string) {
    const [hours, minutes] = hourString
            .split(':') // ["18" , "00"]
            .map(Number) // [18 , 00]

    const minutesAmount = (hours * 60) + minutes;

    return minutesAmount;
}
