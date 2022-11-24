import * as http from 'http'

export const httpRequest = async (options, body) =>
  new Promise((resolve, reject) => {
    const finalOptions = {
      port: process.env.PROXY_PORT,
      hostname: process.env.PROXY_HOST,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    console.log({ finalOptions })
    const postRequest = http
      .request(finalOptions, resp => {
        let data = ''

        // A chunk of data has been received.
        resp.on('data', chunk => {
          data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          const responseBody = JSON.parse(data)
          console.log(`data from httpRequest ${options.path}`, data)
          resolve(responseBody)
        })
      })
      .on('error', err => {
        console.log('Error at httpRequest helper: ' + err.message)
        reject(err)
      })

    if (body) {
      postRequest.write(JSON.stringify(body))
    }
    postRequest.end()
  })
