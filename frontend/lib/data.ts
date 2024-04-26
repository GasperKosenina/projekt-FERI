'use server'
import { Dataset, Item } from "./definitions"

export async function fetchData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/call`)
    const data : Item[] = await response.json()
    console.log(data)
    return data
}

export async function postDataset(formData: FormData){
    console.log('formData', formData)
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset`, {
    //     method: 'POST',
    //     body: formData
    // })
    // const data : Dataset = await response.json()
    // console.log(data)
    // return data
}