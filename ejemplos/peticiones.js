export function peticionGet(url) {
    return fetch(url).then(data => {return data.json()});
}

export function peticionPost(url, dato) {
    return fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "es-419,es;q=0.9",
            "content-type": "text/plain;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site"
        },
        "body": JSON.stringify(dato),
        "method": "POST",
        "mode": "cors",
    }).then(data => data.json());
}