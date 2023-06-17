
export default interface bookModel{
    volumeInfo : volumeInfo,
    totalItems:number,
}

export interface volumeInfo{
    title? : string,
    authors?: String [],
    description? : string,
    language?: string,
    pageCount? : number,
    publishedDate?: string,
    publisher?: string,
    imageLinks? : Thumbnails,
}

export interface Thumbnails{
    smallThumbnail : string,
    thumbnail: string,
}