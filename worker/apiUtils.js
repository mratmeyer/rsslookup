const apiHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'content-type': 'application/json'
}


export function errorResponse(message) {
    return new Response(JSON.stringify(
        {
            "status": "500",
            "message": message
        }),
        {
            headers: apiHeaders,
            status: 500
        }
    )
}

export function successfulResponse(message) {
    return new Response(JSON.stringify(
        {
            "status": "200",
            "message": message
        }),
        {
            headers: apiHeaders,
            status: 200
        }
    )
}

export function resultResponse(result) {
    return new Response(JSON.stringify(result),
    {
      headers: apiHeaders,
      status: 200
    }
  )
}