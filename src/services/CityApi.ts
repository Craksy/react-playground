const url_base = "https://cityinfo.buchwaldshave34.dk/api/"

export interface City{
    cityId: number
    name: string
    description: string
    countryID: number
    country: Country
    numberOfPointsOfInterest: number
    pointsOfInterest: PointOfInterest[]
    cityLanguages: CityLanguage[],
}

export type PointOfInterest={
    pointOfInterestId: number
    cityId: number
    name: string
    description: string
}

export type CityLanguage = {
    languageId: number
    languageName: string
}
export type Country = {
    countryId: number
    countryName: string
}

export async function GetCity(cityId: number): Promise<City>{
    let response = await fetch(url_base.concat(`city/${cityId}`))
    if (response.ok){
        let data: City = await response.json()
        return data
    }
    throw new Error(`Failed to fetch data from API: ${response.statusText}`)

}

export async function GetCities( includeRelations: boolean = true, lazy: boolean = true, useMapster:boolean = true)
: Promise<City[]> {
    let response = await fetch(url_base.concat('city'))
    if (response.ok){
        let data: City[] = await response.json()
        return data
    }
    throw new Error(`Failed to fetch data from API: ${response.statusText}`)
}