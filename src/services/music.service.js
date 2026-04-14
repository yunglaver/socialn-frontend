import {apiFetch} from "../core/api.js";

export async function getMyMusic() {
    const token = localStorage.getItem('token');
    const response = await apiFetch(
        `/music/my`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}


export async function getOtherMusic() {
    const token = localStorage.getItem('token');
    const response = await apiFetch(
        `/music/all`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

export async function uploadMusic( audioFile, artistName, songTitle, coverFile, isPublic ) {

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('artistName', artistName)
    formData.append('songTitle', songTitle)
    formData.append('isPublic', String(Number(isPublic)));
    formData.append('audioFile', audioFile);
    formData.append('coverPic', coverFile)


    const response = await apiFetch("/music", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return await response.json();
}





