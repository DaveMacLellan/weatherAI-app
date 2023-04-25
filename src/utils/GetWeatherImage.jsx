import { sunCloudIcon, sunIcon, snowIcon, rainIcon, cloudIcon, stormIcon, unknownIcon } from "../assets/images/image"

export default function GetWeatherImage(weather){
    let weatherImage = null

    switch(weather){
        case "Clear":
            weatherImage = sunIcon
            break;
        
        case "Rain":
            weatherImage = rainIcon
            break

        case "Snow":
            weatherImage = snowIcon
            break
        
        case "Clouds":
            weatherImage = cloudIcon
            break
        
        case "Thunderstorm":
            weatherImage = stormIcon
            break
        
        case null:
            weatherImage = unknownIcon
            break

        default:
            weatherImage = unknownIcon
            break;
    }

    return weatherImage
}
