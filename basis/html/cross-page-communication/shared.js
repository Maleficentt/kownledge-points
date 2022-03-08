// let data = null
// self.addEventListener('connect', e => {
//   const port = e.ports[0]
//   port.addEventListener('message', event => {
//     if (event.data.get) {
//       data && port.postMessage(data)
//     } else {
//       data = event.data
//     }
//   })
//   port.start()
// })
onconnect = (e) => {
  const port = e.ports[0]
  port.onmessage = (e) => {
    const data = e.data
    port.postMessage(data)
  }
}