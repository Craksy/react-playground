import {Column, Cell, Table2, CellRenderer, SelectionModes, Region} from '@blueprintjs/table'
import { Blockquote, Button, Card, Collapse, Divider, H1, Tag, Text } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { City, GetCities, PointOfInterest } from '../../services/CityApi';
import './CityInfo.scss'
import { H5 } from '@blueprintjs/core';
import { JsxElement } from 'typescript';
import { H6 } from '@blueprintjs/core';
import { ISelectedRegionTransform } from '@blueprintjs/table/lib/esm/interactions/selectable';

const lerp = (a:number,b:number,t:number) => b*t + a*(1-t);
const base_url = "https://via.placeholder.com/";


const generateRandomGallary = (size_range: [number,number], aspect_range: [number,number], image_count: number): string[] => 
    [...Array(image_count).keys()].map(() => {
        const aspect = lerp(...aspect_range, Math.random());
        const scale = lerp(...size_range, Math.random());
        return `${base_url}${Math.round(scale*aspect)}x${Math.round(scale)}`;
    })

const PoiView = (poi: PointOfInterest) => {

    let gallery_images = generateRandomGallary([200,400],[0.5,2], 1);
    console.log(gallery_images);
    const [ showGallary, setShowGallary ] = useState(false);
    
    return <div className="poi-gallary">
        <H6>{poi.name}</H6>
        <p className='bp4-text-muted'>{poi.description}</p>
        <div>
            <Button minimal outlined onClick={() => setShowGallary(!showGallary)}>{showGallary ? "Hide" : "Show"} gallary</Button>
            <Collapse isOpen={showGallary}>
                {gallery_images.map((url, i) => <div key={`${poi.pointOfInterestId}${i}`}><img src={url} alt="gallery" /></div>)}
            </Collapse>
        </div>

    </div>
}

const Carousel = (children: React.ReactNode[]) => {
    const currentSlide = useState(0);
    return(<div className='carousel'>
        <ul className='carousel-container'>
            { children.map((child) => (
                <li className='carousel-item'>{child} </li>)) 
            }
        </ul>
    </div>)
}

const DetailsView = (city: City) => {
    const [showPois, setShowPois] = useState(false);
    return (
        <Card style={{ display: "flex", flexDirection: "column" }} title={city.name}>
            <H1>{city.name}</H1>
            <span className='subtitle'>{city.country.countryName}</span>
            <Blockquote style={{ alignSelf: "flex-start" }} label='foo'>{city.description}</Blockquote>
            <Divider />
            <div className='detail-row'>
                <H5>Country</H5>
                <Text id='country-field'>{city.country.countryName}</Text>
            </div>
            <div className='detail-row'>
                <H5>Languages</H5>
                {city.cityLanguages.map(lang =>  <Tag key={`lang${lang.languageId}`} minimal interactive intent='primary' round>{lang.languageName}</Tag> )}
            </div>
            {city.numberOfPointsOfInterest > 0 ? <>
                <div className='detail-row'>
                    <H5>Points of interest </H5>
                    <Button outlined intent='primary' onClick={() => setShowPois(!showPois)}>{city.numberOfPointsOfInterest} items. {showPois ? "Hide" : "Show"}</Button>
                </div>
                <Collapse isOpen={showPois}>
                    {showPois ? city.pointsOfInterest.map(poi =>
                        <><PoiView key={poi.pointOfInterestId} {...poi}/><Divider/></>
                    ) : <></>}
                </Collapse>
            </> : 
                <div className='detail-row'>
                    <H5>Points of interest </H5>
                    <p>no POIs have been added for this location</p>
                </div>}
        </Card>)
}


export default function CityInfo() {

    const [cities, setCities] = useState<City[]>();
    const [selectedCity, setSelectedCity] = useState<City>();

    useEffect(() => { 
        const getData = async () => {
            const res = await GetCities(true, true, true);
            try {
                setCities(res);
            } catch (e) {
                console.log("Error: ", e);
            }
        }
            GetCities(true, true, true).then(data => setCities(data)).catch(console.log);
        },
    [])

    const handleSelection = (region:Region[]) => {
        const row = region[0].rows?.[0];
        if(row) {
            setSelectedCity(cities?.[row]);
        }
    }

    const transformSelection: ISelectedRegionTransform = (region, e) => {
        return {rows: region.rows, cols: null}
    }


    const renderSimple: CellRenderer = (row: number, col: number) =>{
        if(cities === undefined || cities === null || row >= cities.length)
            return <></>
        const city = cities[row]
        let cell:string; 
        console.log("render column", col);
        const p = Object.keys(city);
        switch(col){
            case 0:
                cell = city.name;
                break;
            case 1:
                cell = city.description;
                break;
            case 2:
                cell = city.country.countryName;
                break;
            case 3:
                cell = city.cityLanguages.length.toString();
                break;
            default:
                return <></>
        }
        return (
            <Cell>{cell}</Cell>
        )
    }


    return (
        <div className='city-info-root'>
            <H1>Cities Overview</H1>
            <div className='city-info-container'>
                <div className='city-info-table-container'>
                    <Table2 onSelection={handleSelection}
                        enableMultipleSelection={false}
                        enableRowHeader={false}
                        selectedRegionTransform={transformSelection}
                        enableColumnInteractionBar={false}
                        selectionModes={SelectionModes.ROWS_AND_CELLS}
                        defaultColumnWidth={200}
                        defaultRowHeight={50}
                        numRows={cities?.length}
                    >
                        <Column name='Name' cellRenderer={renderSimple} />
                        <Column name='Description' cellRenderer={renderSimple} />
                        <Column name='Country' cellRenderer={renderSimple} />
                        <Column name='Languages' cellRenderer={renderSimple} />
                    </Table2>
                </div>
                <div className='city-info-details-container'>
                    {selectedCity != null ? <DetailsView {...selectedCity} /> : <></>}
                </div>
            </div>
        </div>
    );
}
